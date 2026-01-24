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
  searchParams: { orderId?: string }
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const orderId = searchParams.orderId;

  if (!orderId) {
    redirect('/cart?error=missing_order_id');
  }

  // Get user preferences to fetch order from orders array
  const userPrefs = await getUserPreferences();

  if (!userPrefs.success) {
    redirect('/auth/signin?error=authentication_required');
  }

  // Find the specific order from user's orders
  const order = userPrefs.orders?.find(order => order.id === orderId);

  if (!order) {
    redirect('/orders?error=order_not_found');
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-xl font-bold mb-6">Payment</h1>
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>}>
        <div className="text-center py-12">
          <Checkoutcomponent
            orderId={orderId}
            cartItems={order.items.map(item => ({
              type: item.type,
              price: item.price,
              quantity: item.quantity
            }))}
          />
        </div>
      </Suspense>
    </div>
  )
}