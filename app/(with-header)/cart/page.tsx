import { Metadata } from "next"
import CartItems from "@/components/cart/CartItems"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Shopping Cart | Smartwave",
  description: "View and manage your shopping cart",
}

export default function CartPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>}>
        <CartItems />
      </Suspense>
    </div>
  )
} 