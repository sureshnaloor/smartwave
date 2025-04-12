// app/actions/payment.js
'use server'

import { connectToDatabase } from '@/lib/mongodb';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

export async function createOrder(formData: FormData) {
  try {
    // Parse form data
    const formDataValue = formData.get('data');
    if (!formDataValue) {
        throw new Error('Form data is missing');
    }
    const data = JSON.parse(formDataValue.toString());
    const { cartItems, amount, shippingDetails } = data;
    
    // Validate request data
    if (!cartItems || !amount) {
      return { error: 'Missing required fields' };
    }

    // Calculate amount in smallest currency unit (paise for INR)
    const amountInPaise = Math.round(amount * 100);
    
    // Create order in Razorpay
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      payment_capture: true,
    });

    // Store order in MongoDB using the provided cart items
    const { db } = await connectToDatabase();
    
    const orderData = {
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      createdAt: new Date(),
      items: cartItems, // Using the cart items from the request
      status: 'created',
      paymentStatus: 'pending',
      shippingDetails: shippingDetails || null
    };
    
    await db.collection('orders').insertOne(orderData);

    return {
      success: true,
      id: order.id,
      amount: amountInPaise,
      currency: order.currency,
    };
  } catch (error) {
    console.error('Create order error:', error);
    return { error: 'Failed to create order' };
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

    const { db } = await connectToDatabase();
    
    // Find the order first
    const order = await db.collection('orders').findOne({ orderId: orderId });
    if (!order) {
      throw new Error('Order not found');
    }

    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === signature;

    // Update order status based on verification result
    const updateData = {
      paymentId: paymentId,
      paymentSignature: signature,
      updatedAt: new Date(),
      ...(isAuthentic 
        ? {
            paymentStatus: 'completed',
            status: 'payment_completed',
            paymentVerifiedAt: new Date()
          }
        : {
            paymentStatus: 'failed',
            status: 'payment_failed',
            verificationError: 'Invalid signature'
          }
      )
    };

    const result = await db.collection('orders').updateOne(
      { orderId: orderId },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      throw new Error('Failed to update order status');
    }

    if (!isAuthentic) {
      return { error: 'Invalid payment signature' };
    }

    // Return success response
    return {
      success: true,
      orderId: orderId,
      paymentId: paymentId,
      status: 'payment_completed'
    };

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
    
    const order = await db.collection('orders').findOne({ orderId: orderId });
    
    if (!order) {
      return { error: 'Order not found' };
    }
    
    // Return order details without sensitive information
    return { 
      success: true, 
      order: {
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        items: order.items,
        shippingDetails: order.shippingDetails ? {
          fullName: order.shippingDetails.fullName,
          addressLine1: order.shippingDetails.addressLine1,
          addressLine2: order.shippingDetails.addressLine2,
          city: order.shippingDetails.city,
          state: order.shippingDetails.state,
          postalCode: order.shippingDetails.postalCode,
          country: order.shippingDetails.country,
          mobileNumber: order.shippingDetails.mobileNumber
        } : null
      }
    };
  } catch (error) {
    console.error('Fetch order details error:', error);
    return { error: 'Failed to fetch order details' };
  }
}