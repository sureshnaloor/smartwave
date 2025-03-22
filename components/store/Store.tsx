"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStoreItems } from "@/app/_actions/user-preferences"
import StoreItemCard from "./StoreItemCard"
import { toast } from "sonner"

// Define types for store items
interface StoreItem {
  id: string
  name: string
  price: number
  type: string
  description: string
  color?: string[] 
  image?: string
}

interface StoreData {
  cards: StoreItem[]
  editPlans: StoreItem[]
}

export default function Store() {
  const [storeItems, setStoreItems] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStoreItems = async () => {
      try {
        const items = await getStoreItems()
        setStoreItems(items)
      } catch (error) {
        console.error("Failed to fetch store items:", error)
        toast.error("Failed to load store items. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStoreItems()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Store</h2>
      
      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="cards">Business Cards</TabsTrigger>
          <TabsTrigger value="edit-plans">Edit Plans</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeItems?.cards.map((item) => (
              <StoreItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                type={item.type}
                description={item.description}
                color={item.color}
                image={item.image}
                showColorSelector={item.type === "color_nfc_card"}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="edit-plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storeItems?.editPlans.map((item) => (
              <StoreItemCard
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                type={item.type}
                description={item.description}
                image={item.image}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 