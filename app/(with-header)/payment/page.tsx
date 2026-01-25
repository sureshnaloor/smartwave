import { Metadata } from "next"
import { Suspense } from "react"
import Checkoutcomponent from "@/components/checkout/Checkout"
import { getUserPreferences } from "@/app/_actions/user-preferences"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Payment | Smartwave",
  description: "Complete your payment",
}

interface PageProps {
  searchParams: { orderId?: string; source?: string }
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const orderId = searchParams.orderId;
  const source = searchParams.source;

  if (!orderId && source !== 'cart') {
    redirect('/cart?error=missing_order_id');
  }

  // Get user preferences
  const userPrefs = await getUserPreferences();

  if (!userPrefs.success) {
    redirect('/auth/signin?error=authentication_required');
  }

  let cartItems: any[] = [];
  let checkoutOrderId: string | undefined = orderId;

  if (source === 'cart') {
    // Check if cart has items
    if (!userPrefs.cart || userPrefs.cart.length === 0) {
      redirect('/cart?error=empty_cart');
    }
    cartItems = userPrefs.cart.map(item => ({
      type: item.type,
      price: item.price,
      quantity: item.quantity,
      productId: item.productId,
      name: item.name,
      image: item.image,
      color: item.color
    }));
  } else {
    // Find the specific order from user's orders
    const order = userPrefs.orders?.find(order => order.id === orderId);

    if (!order) {
      redirect('/orders?error=order_not_found');
    }

    cartItems = order.items.map(item => ({
      type: item.type,
      price: item.price,
      quantity: item.quantity
    }));
  }

  return (
    <div className="container mx-auto py-10">
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-smart-teal"></div>
      </div>}>
        <Checkoutcomponent
          orderId={checkoutOrderId}
          cartItems={cartItems}
        />
      </Suspense>
    </div>
  )
}