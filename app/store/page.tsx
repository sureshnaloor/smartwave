import { Metadata } from "next"
import { Suspense } from "react"
import { getStoreItems } from "@/app/_actions/user-preferences"
import StoreItems from "@/components/store/StoreItems"

export const metadata: Metadata = {
  title: "Store | Smartwave",
  description: "Browse and purchase Smartwave cards and services",
}

export default async function StorePage() {
  const storeItemsData = await getStoreItems()
  
  // Flatten all items into a single array for rendering
  const allItems = [
    ...storeItemsData.cards,
    ...storeItemsData.editPlans
  ]
  
  // Group items by type for categorized display
  const groupedItems = allItems.reduce<Record<string, any[]>>((acc, item) => {
    const type = item.type || "Other"
    if (!acc[type]) {
      acc[type] = []
    }
    acc[type].push(item)
    return acc
  }, {})

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Smartwave Store</h1>
      
      <div className="space-y-12">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold capitalize">{category.replace(/_/g, " ")}</h2>
            <Suspense fallback={
              <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>
            }>
              <StoreItems items={items} />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  )
} 