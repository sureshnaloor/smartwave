import { Metadata } from "next"
import { Suspense } from "react"
import OrdersList from "@/components/orders/OrdersList"

export const metadata: Metadata = {
  title: "Your Orders | SmartWave",
  description: "View your order history",
}

export default function OrdersPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>}>
        <OrdersList />
      </Suspense>
    </div>
  )
} 