import { Metadata } from "next"
import { Suspense } from "react"
import WishlistItems from "@/components/wishlist/WishlistItems"

export const metadata: Metadata = {
  title: "Your Wishlist | SmartWave",
  description: "View and manage your wishlist",
}

export default function WishlistPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      <Suspense fallback={<div className="w-full h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>}>
        <WishlistItems />
      </Suspense>
    </div>
  )
} 