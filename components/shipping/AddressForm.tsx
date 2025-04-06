"use client"

import { useState, useEffect} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { saveShippingAddress, updateShippingAddress } from "@/app/_actions/user-preferences";
import { Loader2 } from "lucide-react";
import type { ShippingAddress } from "@/app/_actions/user-preferences";

interface AddressFormProps {
  address?: ShippingAddress | null;  // Update to use ShippingAddress type
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddressForm({ address, onSuccess, onCancel }: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);

  // Pre-fill form if editing
  useEffect(() => {
    if (address) {
      const form = document.querySelector('form');
      if (form) {
        Object.entries(address).forEach(([key, value]) => {
          if (key === 'isDefault') {
            setIsDefault(value as boolean);
            return;
          }
          if (key === 'id') {
            return; // Skip the id field
          }
          const input = form.elements.namedItem(key) as HTMLInputElement;
          if (input && value !== undefined) {
            input.value = value.toString();
          }
        });
      }
    }
  }, [address]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const addressData = {
        fullName: formData.get('fullName') as string,
        addressLine1: formData.get('addressLine1') as string,
        addressLine2: formData.get('addressLine2') as string || undefined,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        postalCode: formData.get('postalCode') as string,
        country: formData.get('country') as string,
        mobileNumber: formData.get('mobileNumber') as string,
        phoneNumber: formData.get('phoneNumber') as string || undefined,
        isDefault: isDefault,
      };

      let result;
      if (address?.id) {
        result = await updateShippingAddress(address.id, addressData);
      } else {
        result = await saveShippingAddress(addressData);
      }

      if (result.success) {
        toast({
          title: address?.id ? "Address Updated" : "Address Saved",
          description: address?.id 
            ? "Your shipping address has been updated successfully."
            : "Your shipping address has been saved successfully.",
        });
        onSuccess?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save shipping address",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" name="fullName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Mobile Number *</Label>
          <Input 
            id="mobileNumber" 
            name="mobileNumber" 
            type="tel"
            pattern="[0-9]+"
            required 
            placeholder="Enter mobile number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
          <Input 
            id="phoneNumber" 
            name="phoneNumber" 
            type="tel"
            pattern="[0-9]+"
            placeholder="Enter landline number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine1">Address Line 1 *</Label>
          <Input id="addressLine1" name="addressLine1" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="addressLine2">Address Line 2</Label>
          <Input id="addressLine2" name="addressLine2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input id="city" name="city" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input id="state" name="state" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input id="postalCode" name="postalCode" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input id="country" name="country" required />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="isDefault" 
          name="isDefault"
          checked={isDefault}
          onCheckedChange={setIsDefault}
        />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            'Save Address'
          )}
        </Button>
      </div>
    </form>
  );
}