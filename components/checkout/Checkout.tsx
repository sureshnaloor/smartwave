'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, verifyPayment } from '@/app/_actions/paymentrazorpay';
import { getUserPreferences } from '@/app/_actions/user-preferences';
import { toast } from 'sonner';

interface ShippingAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  mobileNumber: string;
}

interface OrderItem {
  type: string;
  price: number;
  quantity: number;
}

export default function Checkout({ cartItems }: { cartItems: OrderItem[] }) {
  const [isPhysicalGoods, setIsPhysicalGoods] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const checkItemsAndFetchData = async () => {
      // Check for physical items (cards)
      const hasPhysicalItems = cartItems.some(item => 
        item.type.toLowerCase().includes('card') && !item.type.toLowerCase().includes('edit')
      );
      setIsPhysicalGoods(hasPhysicalItems);

      // Fetch user data and addresses if needed
      try {
        const userPrefs = await getUserPreferences();
        if (userPrefs.success) {
          setUserEmail((userPrefs as { email?: string }).email || '');
          if (hasPhysicalItems && userPrefs.shippingAddresses) {
            setShippingAddresses(userPrefs.shippingAddresses);
            setShowAddressForm(userPrefs.shippingAddresses.length === 0);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    checkItemsAndFetchData();
  }, [cartItems]);

  const handleAddressSelect = (address: ShippingAddress) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
  };

  const handlePayment = async () => {
    if (isPhysicalGoods && !selectedAddress) {
      toast.error("Please select a shipping address");
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
        email: userEmail
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
        handler: async function(response: {
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
              router.push('/orders');
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>{item.type} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
          </div>
        </div>
      </div>

      {isPhysicalGoods && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
          {!selectedAddress && (
            <div className="space-y-4">
              {shippingAddresses.map((address) => (
                <div 
                  key={address.id}
                  className="border p-4 rounded-lg cursor-pointer hover:border-blue-500"
                  onClick={() => handleAddressSelect(address)}
                >
                  <p className="font-semibold">{address.fullName}</p>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>{address.city}, {address.state}</p>
                  <p>{address.postalCode}, {address.country}</p>
                  <p>Phone: {address.mobileNumber}</p>
                </div>
              ))}
            </div>
          )}
          
          {selectedAddress && (
            <div className="border p-4 rounded-lg">
              <p className="font-semibold">{selectedAddress.fullName}</p>
              <p>{selectedAddress.addressLine1}</p>
              {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
              <p>{selectedAddress.city}, {selectedAddress.state}</p>
              <p>{selectedAddress.postalCode}, {selectedAddress.country}</p>
              <p>Phone: {selectedAddress.mobileNumber}</p>
              <button 
                onClick={() => setSelectedAddress(null)}
                className="mt-2 text-blue-500 hover:text-blue-700"
              >
                Change Address
              </button>
            </div>
          )}
        </div>
      )}

      <button 
        onClick={handlePayment}
        disabled={isLoading || (isPhysicalGoods && !selectedAddress)}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
}