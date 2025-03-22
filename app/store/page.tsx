import { Metadata } from "next"
import Store from "@/components/store/Store"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Store | SmartWave",
  description: "Shop for business cards and editing plans",
}

export default function StorePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">SmartWave Store</h1>
      <p className="text-gray-500 mb-8">
        Shop for business cards and editing plans. Select from our range of premium options to find the perfect match for your needs.
      </p>
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>}>
        <Store />
      </Suspense>
    </div>
  )
} 