'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, verifyPayment } from '@/app/_actions/paymentrazorpay';
import { getUserPreferences } from '@/app/_actions/user-preferences';
import { toast } from 'sonner';
import AddressForm from '@/components/shipping/AddressForm';
import { Plus, ArrowLeft } from 'lucide-react';
import type { ShippingAddress } from '@/app/_actions/user-preferences';
import { useCart } from "@/context/CartContext";

interface OrderItem {
  type: string;
  price: number;
  quantity: number;
}

export default function Checkout({ cartItems, orderId }: { cartItems: OrderItem[], orderId?: string }) {
  const [isPhysicalGoods, setIsPhysicalGoods] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const router = useRouter();
  const { refreshCart } = useCart();

  const fetchAddresses = useCallback(async (selectNewest = false) => {
    try {
      setIsDataLoading(true);
      const userPrefs = await getUserPreferences();
      if (userPrefs.success) {
        setUserEmail((userPrefs as { email?: string }).email || '');
        const addresses = userPrefs.shippingAddresses || [];
        setShippingAddresses(addresses);

        // If we just added a new address, select the most recent one
        if (selectNewest && addresses.length > 0) {
          // Assuming the last one in the array or newest ID is the one just added
          const newest = addresses[addresses.length - 1];
          setSelectedAddress(newest);
          setShowAddressForm(false);
        } else if (addresses.length > 0 && !selectedAddress) {
          // Auto-select default or first address if none selected
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
  }, [selectedAddress]);

  useEffect(() => {
    // Check for physical items (cards)
    const hasPhysicalItems = cartItems.some(item =>
      item.type.toLowerCase().includes('card') && !item.type.toLowerCase().includes('edit')
    );
    setIsPhysicalGoods(hasPhysicalItems);

    fetchAddresses();
  }, [cartItems, fetchAddresses]);

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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-10 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-smart-teal/5 blur-3xl -mr-16 -mt-16 rounded-full" />

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-smart-teal/10 text-smart-teal text-sm">1</span>
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

      {isPhysicalGoods && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-smart-teal/10 text-smart-teal text-sm">2</span>
              Shipping Information
            </h2>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-smart-teal hover:text-smart-teal/80 transition-colors bg-smart-teal/5 px-3 py-1.5 rounded-full"
              >
                <Plus className="h-4 w-4" /> Add New
              </button>
            )}
          </div>

          {showAddressForm ? (
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-smart-teal/20 shadow-xl shadow-smart-teal/5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-8 cursor-pointer text-gray-500 hover:text-smart-teal transition-colors group" onClick={() => setShowAddressForm(false)}>
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-semibold uppercase tracking-wider">Back to saved addresses</span>
              </div>
              <AddressForm
                onSuccess={() => fetchAddresses(true)}
                onCancel={() => setShowAddressForm(false)}
              />
            </div>
          ) : (
            <div className="grid gap-4">
              {shippingAddresses.length === 0 && !isDataLoading && (
                <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No addresses found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Please add a shipping address to complete your order.</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="inline-flex items-center gap-2 bg-smart-teal text-white px-6 py-2.5 rounded-xl font-bold hover:bg-smart-teal/90 transition-all shadow-lg shadow-smart-teal/20"
                  >
                    Add Shipping Address
                  </button>
                </div>
              )}

              {shippingAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${selectedAddress?.id === address.id
                    ? 'border-smart-teal bg-smart-teal/[0.03] shadow-lg shadow-smart-teal/5'
                    : 'border-gray-100 dark:border-white/5 bg-white dark:bg-zinc-900 hover:border-smart-teal/30'
                    }`}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">{address.fullName}</p>
                        {address.isDefault && (
                          <span className="text-[10px] bg-smart-teal/10 text-smart-teal px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Default</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>{address.city}, {address.state} {address.postalCode}</p>
                        <p className="font-semibold text-gray-500 mt-1 uppercase tracking-wider text-[11px]">{address.country}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-900 dark:text-gray-200">
                        <span className="p-1 rounded bg-gray-100 dark:bg-white/10 uppercase tracking-tighter">Mobile</span>
                        {address.mobileNumber}
                      </div>
                    </div>
                    <div className={`h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedAddress?.id === address.id
                      ? 'bg-smart-teal border-smart-teal'
                      : 'border-gray-200 dark:border-white/10'
                      }`}>
                      {selectedAddress?.id === address.id && (
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading || (isPhysicalGoods && !selectedAddress) || showAddressForm}
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