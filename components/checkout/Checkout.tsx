'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, verifyPayment } from '@/app/_actions/paymentrazorpay';
import { getUserPreferences } from '@/app/_actions/user-preferences';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import type { ShippingAddress } from '@/app/_actions/user-preferences';
import { useCart } from "@/context/CartContext";

interface OrderItem {
  type: string;
  price: number;
  quantity: number;
}

export default function Checkout({ cartItems, orderId }: { cartItems: OrderItem[], orderId?: string }) {
  const [isPhysicalGoods, setIsPhysicalGoods] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();
  const { refreshCart } = useCart();

  const fetchAddresses = useCallback(async () => {
    try {
      setIsDataLoading(true);
      const userPrefs = await getUserPreferences();
      if (userPrefs.success) {
        setUserEmail((userPrefs as { email?: string }).email || '');
        const addresses = userPrefs.shippingAddresses || [];

        // Auto-select default or first address
        if (addresses.length > 0) {
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          setSelectedAddress(defaultAddr);
        }

        return addresses;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsDataLoading(false);
    }
    return [];
  }, []);

  useEffect(() => {
    // Check for physical items (cards)
    const hasPhysicalItems = cartItems.some(item =>
      item.type.toLowerCase().includes('card') && !item.type.toLowerCase().includes('edit')
    );
    setIsPhysicalGoods(hasPhysicalItems);

    fetchAddresses();
  }, [cartItems, fetchAddresses]);

  const handlePayment = async () => {
    if (isPhysicalGoods && !selectedAddress) {
      toast.error("Please go back and select a shipping address");
      router.push('/checkout/address?source=cart');
      return;
    }

    try {
      setIsLoading(true);

      const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      const formData = new FormData();
      formData.append('data', JSON.stringify({
        cartItems,
        amount: totalAmount,
        shippingDetails: isPhysicalGoods ? selectedAddress : null,
        email: userEmail,
        orderId // Pass the orderId to createOrder
      }));

      const response = await createOrder(formData);

      if (response.error) {
        throw new Error(response.error);
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.amount,
        currency: response.currency,
        name: 'Smartwave',
        description: `Order ${response.id}`,
        order_id: response.id,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          try {
            // Create form data for verification
            const formData = new FormData();
            formData.append('data', JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }));

            const result = await verifyPayment(formData);

            if (result.success) {
              toast.success('Payment successful!');
              // Refresh cart to update badge
              await refreshCart();
              // Redirect to success page
              router.push(`/order-success?orderId=${result.finalOrderId || result.orderId}`);
            } else {
              throw new Error(result.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: selectedAddress?.fullName || '',
          email: userEmail,
          contact: selectedAddress?.mobileNumber || ''
        },
        notes: {
          shipping_address: isPhysicalGoods && selectedAddress ?
            `${selectedAddress.fullName}, ${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} - ${selectedAddress.postalCode}` :
            'Digital Product',
          order_type: isPhysicalGoods ? 'Physical' : 'Digital'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment initialization failed:', error);
      toast.error('Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/checkout/address?source=cart');
  };

  if (isDataLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-smart-teal"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-smart-teal transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Address</span>
        </button>
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-smart-teal text-white text-sm font-bold">3</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Secure Payment</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Review your order and complete the payment
        </p>
      </div>

      <div className="mb-10 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-smart-teal/5 blur-3xl -mr-16 -mt-16 rounded-full" />

        <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
          Order Summary
        </h2>

        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-smart-teal transition-colors tracking-tight italic">{item.type}</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Quantity: {item.quantity}</span>
              </div>
              <span className="font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-6 mt-8">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Payable</span>
              <span className="text-xs text-gray-400">Including all taxes</span>
            </div>
            <span className="text-3xl font-black text-smart-teal tracking-tighter tabular-nums">
              ₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}
            </span>
          </div>
        </div>
      </div>

      {isPhysicalGoods && selectedAddress && (
        <div className="mb-8 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            Shipping Address
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">{selectedAddress.fullName}</p>
            <p>{selectedAddress.addressLine1}</p>
            {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}</p>
            <p>{selectedAddress.country}</p>
            <p className="mt-2">Mobile: {selectedAddress.mobileNumber}</p>
          </div>
          <button
            onClick={handleBack}
            className="mt-4 text-sm text-smart-teal hover:text-smart-teal/80 font-semibold"
          >
            Change Address
          </button>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading || (isPhysicalGoods && !selectedAddress)}
        className="w-full bg-smart-teal hover:bg-smart-teal/90 text-white py-4.5 rounded-2xl font-black text-xl shadow-xl shadow-smart-teal/20 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] uppercase tracking-tighter"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Securing Payment...</span>
          </div>
        ) : (
          `Secure Checkout • ₹${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}`
        )}
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        Secure payments powered by Razorpay. All transactions are encrypted.
      </p>
    </div>
  );
}