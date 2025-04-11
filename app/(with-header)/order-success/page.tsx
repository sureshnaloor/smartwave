// app/order-success/page.jsx
'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderDetails } from '@/app/_actions/paymentrazorpay';

export default function OrderSuccess() {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Fetch order details when orderId is available
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const data = await getOrderDetails(id);
      
      if (data.success) {
        setOrderDetails(data.order as any);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been successfully processed.</p>
        
        {orderDetails && (
          <div className="order-summary">
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> {(orderDetails as any).orderId}</p>
            <p><strong>Amount:</strong> ₹{((orderDetails as any).amount / 100).toFixed(2)}</p>
            
            {(orderDetails as any).shippingDetails && (
              <div className="shipping-info">
                <h3>Shipping Information</h3>
                <p>{(orderDetails as any).shippingDetails.name}</p>
                <p>{(orderDetails as any).shippingDetails.address}</p>
                <p>{(orderDetails as any).shippingDetails.city}, {(orderDetails as any).shippingDetails.state} {(orderDetails as any).shippingDetails.postalCode}</p>
            
              </div>
            )}
          </div>
        )}
        
        <div className="action-buttons">
          <Link href="/" className="home-button">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}