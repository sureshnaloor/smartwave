import { Metadata } from "next"
import { Suspense } from "react"
import Checkoutcomponent from "@/components/checkout/Checkout"

export const metadata: Metadata = {
  title: "Payment | Smartwave",
  description: "Complete your payment",
}

export default function PaymentPage() {
  // Sample cart items for testing, remove after testing
  const sampleCartItems = {
    productId: "PROD_001",
    price: 999,
    currency: "INR",
    quantity:3,
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-xl font-bold mb-6">Payment</h1>
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>}>
        <div className="text-center py-12">
          {/* <p className="text-gray-600">Payment Gateway Integration Coming Soon</p> */}
          <Checkoutcomponent cartItems={[{
            type: sampleCartItems.productId,
            price: sampleCartItems.price,
            quantity: sampleCartItems.quantity
          }]} />
        </div>
      </Suspense>
    </div>
  )
}