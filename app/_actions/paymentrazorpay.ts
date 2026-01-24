// app/actions/payment.js
'use server'

import { connectToDatabase } from '@/lib/mongodb';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Initialize Razorpay
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!key_id || !key_secret) {
    console.error('Razorpay credentials missing:', {
      has_key: !!key_id,
      has_secret: !!key_secret
    });
  }

  console.log('Initializing Razorpay with:', {
    key_id: key_id ? `${key_id.substring(0, 8)}...` : 'not found',
    has_secret: !!key_secret,
    secret_len: key_secret?.length
  });

  return new Razorpay({
    key_id: key_id || '',
    key_secret: key_secret || ''
  });
};

export async function createOrder(formData: FormData) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { error: "User not authenticated" };
    }

    // Parse form data
    const formDataValue = formData.get('data');
    if (!formDataValue) {
      throw new Error('Form data is missing');
    }
    const data = JSON.parse(formDataValue.toString());
    const { cartItems, amount, shippingDetails, orderId } = data;

    // Validate request data
    if (!cartItems || !amount) {
      return { error: 'Missing required fields' };
    }

    // Calculate amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);

    // Connect to database
    const { db } = await connectToDatabase();

    // Find specify user preference
    const userPref = await db.collection('userpreferences').findOne({
      email: session.user.email
    });

    if (!userPref) {
      throw new Error('User profile not found. Please try adding items to cart again.');
    }

    // If orderId is provided, we use the existing pending order
    // If not, we are creating a new "draft" order from the cart
    let pendingOrder;
    let isCartOrder = false;

    if (orderId) {
      pendingOrder = userPref.orders?.find((order: any) => order.id === orderId);
      if (!pendingOrder) {
        throw new Error('Specific pending order not found');
      }
    } else {
      isCartOrder = true;
      // Generate a temporary ID for tracking
      pendingOrder = {
        id: `DRAFT-${Date.now().toString(36).toUpperCase()}`
      };
    }

    // Create order in Razorpay
    const razorpay = getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: pendingOrder.id,
      payment_capture: true,
    });

    // Create razorpayPayment object
    const razorpayPayment = {
      orderId: razorpayOrder.id,
      originalOrderId: pendingOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      createdAt: new Date(),
      items: cartItems,
      status: 'created',
      paymentStatus: 'pending',
      shippingDetails: shippingDetails || null
    };

    // Update userpreferences with razorpay payment info
    const updateQuery: any = { email: session.user.email };
    const updateDoc: any = {
      $push: { 'razorpayPayments': razorpayPayment }
    };

    // If it was an existing order, we match it for potential status updates later
    if (!isCartOrder) {
      updateQuery['orders.id'] = pendingOrder.id;
    }

    await db.collection('userpreferences').updateOne(updateQuery, updateDoc);

    return {
      success: true,
      id: razorpayOrder.id,
      originalOrderId: pendingOrder.id,
      amount: amountInPaise,
      currency: razorpayOrder.currency,
      isCartOrder
    };
  } catch (error) {
    console.error('Create order error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to create order' };
  }
}

export async function verifyPayment(formData: FormData) {
  try {
    const formDataValue = formData.get('data');
    if (!formDataValue) {
      throw new Error('Form data is missing');
    }

    const data = JSON.parse(formDataValue.toString());
    const { orderId, paymentId, signature } = data;

    if (!orderId || !paymentId || !signature) {
      throw new Error('Missing required fields');
    }

    // Connect to database and find payment details
    const { db } = await connectToDatabase();
    const userPref = await db.collection('userpreferences').findOne({
      'razorpayPayments.orderId': orderId
    });

    if (!userPref) {
      throw new Error('Order not found');
    }

    const razorpayPayment = userPref.razorpayPayments.find((p: { orderId: string }) => p.orderId === orderId);
    if (!razorpayPayment) {
      throw new Error('Payment details not found');
    }

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", (process.env.RAZORPAY_KEY_SECRET || '').trim())
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === signature;

    if (isAuthentic) {
      // 1. Create the Final Order object
      const finalOrderId = razorpayPayment.originalOrderId.startsWith('DRAFT-')
        ? `ORD-${Date.now().toString(36).toUpperCase()}`
        : razorpayPayment.originalOrderId;

      const newOrder = {
        id: finalOrderId,
        date: new Date().toISOString(),
        orderDate: new Date().toISOString(),
        status: 'payment_made', // Final status
        total: razorpayPayment.amount / 100,
        items: razorpayPayment.items,
        shippingAddress: razorpayPayment.shippingDetails,
        paymentId: paymentId
      };

      // 2. Perform Atomic Update: Add Order, Update Payment, Clear Cart
      const updateDoc: any = {
        $set: {
          'razorpayPayments.$.paymentId': paymentId,
          'razorpayPayments.$.paymentSignature': signature,
          'razorpayPayments.$.paymentStatus': 'completed',
          'razorpayPayments.$.status': 'payment_completed',
          'razorpayPayments.$.paymentVerifiedAt': new Date(),
          'razorpayPayments.$.updatedAt': new Date()
        }
      };

      if (razorpayPayment.originalOrderId.startsWith('DRAFT-')) {
        // From Cart: Add to orders AND clear cart
        updateDoc.$push = { orders: newOrder };
        updateDoc.$set.cart = [];
      } else {
        // From Existing Order: Update the order status
        updateDoc.$set['orders.$.status'] = 'payment_made';
        updateDoc.$set['orders.$.paymentId'] = paymentId;
      }

      await db.collection('userpreferences').updateOne(
        {
          'razorpayPayments.orderId': orderId,
          // Only add orders.id filter if it's not a draft order
          ...(!razorpayPayment.originalOrderId.startsWith('DRAFT-') && { 'orders.id': razorpayPayment.originalOrderId })
        },
        updateDoc
      );

      return {
        success: true,
        orderId: orderId,
        finalOrderId: finalOrderId,
        paymentId: paymentId,
        status: 'payment_completed'
      };
    }

    // Handle failed payment
    await db.collection('userpreferences').updateOne(
      { 'razorpayPayments.orderId': orderId },
      {
        $set: {
          'razorpayPayments.$.paymentId': paymentId,
          'razorpayPayments.$.paymentStatus': 'failed',
          'razorpayPayments.$.status': 'payment_failed',
          'razorpayPayments.$.verificationError': 'Invalid signature',
          'razorpayPayments.$.updatedAt': new Date()
        }
      }
    );

    return { error: 'Invalid payment signature' };

  } catch (error) {
    console.error('Verify payment error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to verify payment'
    };
  }
}

export async function getOrderDetails(orderId: string) {
  if (!orderId) {
    return { error: 'Order ID is required' };
  }

  try {
    const { db } = await connectToDatabase();

    // Find order in userpreferences collection
    const userPref = await db.collection('userpreferences').findOne({
      $or: [
        { 'razorpayPayments.orderId': orderId },
        { 'orders.id': orderId }
      ]
    });

    if (!userPref) {
      return { error: 'Order not found' };
    }

    // Find the specific order/payment
    const razorpayPayment = userPref.razorpayPayments?.find((p: { orderId: string }) => p.orderId === orderId);
    const order = userPref.orders?.find((o: { id: string }) => o.id === orderId);

    const orderDetails = razorpayPayment || order;
    if (!orderDetails) {
      return { error: 'Order details not found' };
    }

    // Return order details without sensitive information
    const finalAmount = razorpayPayment ? (razorpayPayment.amount / 100) : order?.total;

    return {
      success: true,
      order: {
        orderId: razorpayPayment?.orderId || order?.id,
        amount: finalAmount,
        currency: orderDetails.currency || 'INR',
        status: orderDetails.status || order?.status,
        items: orderDetails.items || [],
        shippingDetails: orderDetails.shippingDetails ? {
          fullName: orderDetails.shippingDetails.fullName || orderDetails.shippingDetails.name,
          addressLine1: orderDetails.shippingDetails.addressLine1 || orderDetails.shippingDetails.address,
          addressLine2: orderDetails.shippingDetails.addressLine2,
          city: orderDetails.shippingDetails.city,
          state: orderDetails.shippingDetails.state,
          postalCode: orderDetails.shippingDetails.postalCode,
          country: orderDetails.shippingDetails.country,
          mobileNumber: orderDetails.shippingDetails.mobileNumber
        } : null
      }
    };
  } catch (error) {
    console.error('Fetch order details error:', error);
    return { error: 'Failed to fetch order details' };
  }
}