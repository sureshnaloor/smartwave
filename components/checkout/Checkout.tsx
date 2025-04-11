// app/components/Checkout.jsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, verifyPayment } from '@/app/_actions/paymentrazorpay';

// Define interface for shipping details
interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

export default function Checkout({ cartItems }: { cartItems: Array<{ type: string; price: number; quantity: number }> }) {
  const [isPhysicalGoods, setIsPhysicalGoods] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const [isShippingComplete, setIsShippingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if cart contains physical goods
  useEffect(() => {
    const hasPhysicalItems = cartItems.some(item => item.type === 'physical');
    setIsPhysicalGoods(hasPhysicalItems);
  }, [cartItems]);

  const handleShippingSubmit = (data: ShippingDetails) => {
    setShippingDetails(data);
    setIsShippingComplete(true);
  };

  const handlePayment = async () => {
    // If physical goods and shipping not complete, show error
    if (isPhysicalGoods && !isShippingComplete) {
      alert("Please complete shipping information before proceeding to payment");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create form data for the server action
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        cartItems,
        amount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
        shippingDetails: isPhysicalGoods ? shippingDetails : null
      }));
      
      // Call server action to create order
      const response = await createOrder(formData);
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Test key
        amount: response.amount,
        currency: response.currency,
        name: 'Sree Krishna',
        description: 'Purchase Description',
        order_id: response.id,
        handler: function(paymentResponse: { razorpay_payment_id: string; razorpay_signature: string }) {
          // Handle successful payment
          if ('id' in response && typeof response.id === 'string') {
            handlePaymentSuccess(paymentResponse, { id: response.id });
          } else {
            throw new Error('Invalid response format');
          }
        },
        prefill: {
          name: shippingDetails?.name?.toString() || '',
          email: shippingDetails?.email || '',
          contact: shippingDetails?.phone || ''
        },
        notes: {
          address: isPhysicalGoods && shippingDetails ? `${shippingDetails.address}, ${shippingDetails.city}` : 'Digital Product'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse: { razorpay_payment_id: string; razorpay_signature: string }, orderData: { id: string }) => {
    try {
      setIsLoading(true);
      
      // Create form data for verification
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        orderId: orderData.id,
        paymentId: paymentResponse.razorpay_payment_id,
        signature: paymentResponse.razorpay_signature
      }));
      
      // Call server action to verify payment
      const result = await verifyPayment(formData);

      if (result.success) {
        // Redirect to success page
        router.push(`/order-success?orderId=${orderData.id}`);
      } else {
        throw new Error(result.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {isPhysicalGoods && !isShippingComplete && (
        <div className="shipping-section">
          <h3>Shipping Information</h3>
          {/* <ShippingForm onSubmit={handleShippingSubmit} /> */}
          <button
            onClick={() => handleShippingSubmit({
              name: "Srikrishna",
              email: "sri@krishna.com",
              phone: "123456789",
              address: "Heaven 1, Dwarka",
              city: "Kailasa"
            })}
            className="pay-button"
            disabled={isLoading}
          >
            {isLoading? 'Processing...' : 'Submit Shipping'}
          </button>
        </div>
      )}

      {(!isPhysicalGoods || isShippingComplete) && (
        <div className="payment-section">
          <h3>Payment</h3>
          <button 
            onClick={handlePayment}
            className="pay-button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      )}
    </div>
  );
}