// app/actions/payment.js
'use server'

import { connectToDatabase } from '@/lib/mongodb';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Initialize Razorpay
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
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

    if (!userPref || !userPref.orders) {
      throw new Error('No user profile or orders found');
    }

    // Find the specific pending order
    let pendingOrder;
    if (orderId) {
      pendingOrder = userPref.orders.find((order: any) => order.id === orderId);
    } else {
      // Fallback: Get the most recent order with a pending status
      pendingOrder = [...userPref.orders].reverse().find((order: any) =>
        ['pending', 'pending_payment', 'address_added'].includes(order.status)
      );
    }

    if (!pendingOrder) {
      throw new Error('No valid pending order found');
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
    await db.collection('userpreferences').updateOne(
      { email: session.user.email, 'orders.id': pendingOrder.id } as any,
      {
        $push: { 'razorpayPayments': razorpayPayment }
      } as any
    );

    return {
      success: true,
      id: razorpayOrder.id,
      originalOrderId: pendingOrder.id,
      amount: amountInPaise,
      currency: razorpayOrder.currency,
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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === signature;

    if (isAuthentic) {
      // Update both razorpayPayment and order status
      await db.collection('userpreferences').updateOne(
        {
          'razorpayPayments.orderId': orderId,
          'orders.id': razorpayPayment.originalOrderId
        },
        {
          $set: {
            'razorpayPayments.$.paymentId': paymentId,
            'razorpayPayments.$.paymentSignature': signature,
            'razorpayPayments.$.paymentStatus': 'completed',
            'razorpayPayments.$.status': 'payment_completed',
            'razorpayPayments.$.paymentVerifiedAt': new Date(),
            'razorpayPayments.$.updatedAt': new Date(),
            'orders.$.status': 'payment_made'
          }
        }
      );

      return {
        success: true,
        orderId: orderId,
        originalOrderId: razorpayPayment.originalOrderId,
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
    return {
      success: true,
      order: {
        orderId: razorpayPayment?.orderId || order?.id,
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        status: orderDetails.status,
        items: orderDetails.items,
        shippingDetails: orderDetails.shippingDetails ? {
          fullName: orderDetails.shippingDetails.fullName,
          addressLine1: orderDetails.shippingDetails.addressLine1,
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