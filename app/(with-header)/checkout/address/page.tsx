import { Metadata } from "next"
import { Suspense } from "react"
import AddressStep from "@/components/checkout/AddressStep"
import { getUserPreferences } from "@/app/_actions/user-preferences"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Shipping Address | Smartwave",
  description: "Add your shipping or billing address",
}

interface PageProps {
  searchParams: { source?: string }
}

export default async function AddressPage({ searchParams }: PageProps) {
  const source = searchParams.source;

  if (source !== 'cart') {
    redirect('/cart?error=invalid_source');
  }

  // Get user preferences
  const userPrefs = await getUserPreferences();

  if (!userPrefs.success) {
    redirect('/auth/signin?error=authentication_required');
  }

  // Check if cart has items
  if (!userPrefs.cart || userPrefs.cart.length === 0) {
    redirect('/cart?error=empty_cart');
  }

  const cartItems = userPrefs.cart.map(item => ({
    type: item.type,
    price: item.price,
    quantity: item.quantity,
    productId: item.productId,
    name: item.name,
    image: item.image,
    color: item.color
  }));

  // Determine if physical goods or digital
  const isPhysicalGoods = cartItems.some(item =>
    item.type.toLowerCase().includes('card') && !item.type.toLowerCase().includes('edit')
  );

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-smart-teal"></div>
      </div>}>
        <AddressStep isPhysicalGoods={isPhysicalGoods} />
      </Suspense>
    </div>
  )
}
