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
      payment_capture: true, // Auto-capture payment
    });

    // Store order in MongoDB
    const { db } = await connectToDatabase();
    
    const orderData = {
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      createdAt: new Date(),
      items: cartItems,
      status: 'created',
      paymentStatus: 'pending',
      shippingDetails: shippingDetails || null
    };
    
    await db.collection('orders').insertOne(orderData);

    // Return order details to client
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
    // Parse form data
    const formDataValue = formData.get('data');
    if (!formDataValue) {
        throw new Error('Form data is missing');
    }
    const data = JSON.parse(formDataValue.toString());
    const { orderId, paymentId, signature } = data;

    // Validate request data
    if (!orderId || !paymentId || !signature) {
      return { error: 'Missing required fields' };
    }

    // Verify the payment signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(`${orderId}|${paymentId}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      return { error: 'Invalid payment signature' };
    }

    // Update order status in MongoDB
    const { db } = await connectToDatabase();
    
    const result = await db.collection('orders').updateOne(
      { orderId: orderId },
      { 
        $set: { 
          paymentId: paymentId,
          paymentStatus: 'completed',
          status: 'paid',
          updatedAt: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return { error: 'Order not found' };
    }

    // Return success response
    return { success: true };
  } catch (error) {
    console.error('Verify payment error:', error);
    return { error: 'Failed to verify payment' };
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
          name: order.shippingDetails.name,
          address: order.shippingDetails.address,
          city: order.shippingDetails.city,
          state: order.shippingDetails.state,
          postalCode: order.shippingDetails.postalCode,
          country: order.shippingDetails.country
        } : null
      }
    };
  } catch (error) {
    console.error('Fetch order details error:', error);
    return { error: 'Failed to fetch order details' };
  }
}