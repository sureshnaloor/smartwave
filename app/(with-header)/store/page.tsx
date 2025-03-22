import { Metadata } from "next"
import { Suspense } from "react"
import StoreItems from "@/components/store/StoreItems"

export const metadata: Metadata = {
  title: "Store | Smartwave",
  description: "Browse and purchase Smartwave cards and services",
}

export default function StorePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Smartwave Store</h1>
      
      <Suspense fallback={
        <div className="w-full h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      }>
        <StoreItems />
      </Suspense>
    </div>
  )
} 