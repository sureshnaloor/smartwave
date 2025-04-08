"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import AddressForm from "./AddressForm";
import { getUserPreferences } from "@/app/_actions/user-preferences";
import type { ShippingAddress } from "@/app/_actions/user-preferences";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/LoadingSpinner";  // Add this import
import { deleteShippingAddress } from "@/app/_actions/user-preferences";

export default function ShippingAddresses() {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const result = await getUserPreferences();
      if (result.success && result.shippingAddresses) {
        setAddresses(result.shippingAddresses);
      }
    } catch (error) {
      // console.error("Error loading addresses:", error);
      toast({
        title: "Error",
        description: "Failed to load shipping addresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleDelete = async (addressId: string) => {
    try {
      const result = await deleteShippingAddress(addressId);
      if (result.success) {
        toast({
          title: "Address Deleted",
          description: "Shipping address has been removed successfully.",
        });
        loadAddresses(); // Refresh the list
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete shipping address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {addresses.length > 0 ? (
        <>
          {/* Existing Addresses */}
          {addresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-gray-500">{address.addressLine1}</p>
                  {address.addressLine2 && (
                    <p className="text-sm text-gray-500">{address.addressLine2}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-gray-500">{address.country}</p>
                  <p className="text-sm text-gray-500">
                    Mobile: {address.mobileNumber}
                    {address.phoneNumber && ` | Phone: ${address.phoneNumber}`}
                  </p>
                  {address.isDefault && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                      Default Address
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingAddress(address)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(address.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {/* Add New Address Button */}
          {!isAddingNew && !editingAddress && (
            <Button
              onClick={() => setIsAddingNew(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Address
            </Button>
          )}
        </>
      ) : (
        <>
          {!isAddingNew && (
            <div className="text-center space-y-4">
              <p className="text-gray-500">No shipping addresses found</p>
              <Button
                onClick={() => setIsAddingNew(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </div>
          )}
        </>
      )}

      {/* Address Form (for new or edit) */}
      {(isAddingNew || editingAddress) && (
        <AddressForm
          address={editingAddress}
          onSuccess={() => {
            setIsAddingNew(false);
            setEditingAddress(null);
            loadAddresses();
          }}
          onCancel={() => {
            setIsAddingNew(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
}