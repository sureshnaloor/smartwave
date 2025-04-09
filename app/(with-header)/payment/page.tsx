import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Payment | Smartwave",
  description: "Complete your payment",
}

export default function PaymentPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Payment</h1>
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>}>
        <div className="text-center py-12">
          <p className="text-gray-600">Payment Gateway Integration Coming Soon</p>
        </div>
      </Suspense>
    </div>
  )
}