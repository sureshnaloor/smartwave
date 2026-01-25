'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUserPreferences } from '@/app/_actions/user-preferences';
import { toast } from 'sonner';
import AddressForm from '@/components/shipping/AddressForm';
import { Plus, ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { ShippingAddress } from '@/app/_actions/user-preferences';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AddressStepProps {
  isPhysicalGoods: boolean;
}

export default function AddressStep({ isPhysicalGoods }: AddressStepProps) {
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  const fetchAddresses = useCallback(async (selectNewest = false) => {
    try {
      setIsDataLoading(true);
      const userPrefs = await getUserPreferences();
      if (userPrefs.success) {
        const addresses = userPrefs.shippingAddresses || [];
        setShippingAddresses(addresses);

        // If we just added a new address, select the most recent one
        if (selectNewest && addresses.length > 0) {
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
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddressSelect = (address: ShippingAddress) => {
    setSelectedAddress(address);
    setShowAddressForm(false);
  };

  const handleConfirm = async () => {
    if (isPhysicalGoods && !selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!isPhysicalGoods && !selectedAddress) {
      toast.error("Please provide billing information");
      return;
    }

    try {
      setIsConfirming(true);
      // Navigate to payment page
      router.push(`/payment?source=cart`);
    } catch (error) {
      toast.error("Failed to proceed. Please try again.");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleBack = () => {
    router.push('/cart');
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
          <span>Back to Cart</span>
        </button>
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-smart-teal text-white text-sm font-bold">2</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isPhysicalGoods ? 'Shipping Address' : 'Billing Information'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {isPhysicalGoods 
            ? 'Please select or add a shipping address for your order'
            : 'Please provide your billing information'}
        </p>
      </div>

      <Card className="mb-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-smart-teal/5 blur-3xl -mr-16 -mt-16 rounded-full" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isPhysicalGoods ? 'Select Shipping Address' : 'Select Billing Address'}
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
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-smart-teal/20 shadow-xl shadow-smart-teal/5 animate-in fade-in zoom-in-95 duration-300 relative z-10">
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
          <div className="grid gap-4 relative z-10">
            {shippingAddresses.length === 0 && !isDataLoading && (
              <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  No addresses found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  Please add a {isPhysicalGoods ? 'shipping' : 'billing'} address to complete your order.
                </p>
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="inline-flex items-center gap-2 bg-smart-teal text-white px-6 py-2.5 rounded-xl font-bold hover:bg-smart-teal/90 transition-all shadow-lg shadow-smart-teal/20"
                >
                  Add {isPhysicalGoods ? 'Shipping' : 'Billing'} Address
                </button>
              </div>
            )}

            {shippingAddresses.map((address) => (
              <div
                key={address.id}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${
                  selectedAddress?.id === address.id
                    ? 'border-smart-teal bg-smart-teal/[0.03] shadow-lg shadow-smart-teal/5'
                    : 'border-gray-100 dark:border-white/5 bg-white dark:bg-zinc-900 hover:border-smart-teal/30'
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
                        {address.fullName}
                      </p>
                      {address.isDefault && (
                        <span className="text-[10px] bg-smart-teal/10 text-smart-teal px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="font-semibold text-gray-500 mt-1 uppercase tracking-wider text-[11px]">
                        {address.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-900 dark:text-gray-200">
                      <span className="p-1 rounded bg-gray-100 dark:bg-white/10 uppercase tracking-tighter">
                        Mobile
                      </span>
                      {address.mobileNumber}
                    </div>
                  </div>
                  <div
                    className={`h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedAddress?.id === address.id
                        ? 'bg-smart-teal border-smart-teal'
                        : 'border-gray-200 dark:border-white/10'
                    }`}
                  >
                    {selectedAddress?.id === address.id && (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Button
        onClick={handleConfirm}
        disabled={isConfirming || !selectedAddress || showAddressForm}
        className="w-full bg-smart-teal hover:bg-smart-teal/90 text-white py-4.5 rounded-2xl font-black text-xl shadow-xl shadow-smart-teal/20 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] uppercase tracking-tighter"
      >
        {isConfirming ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Confirm & Continue to Payment
          </span>
        )}
      </Button>

      <p className="text-center text-xs text-gray-400 mt-4">
        You can edit your address after confirming if needed
      </p>
    </div>
  );
}
