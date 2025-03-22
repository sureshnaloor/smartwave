"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStoreItems } from "@/app/_actions/user-preferences"
import StoreItemCard from "@/components/store/StoreItemCard"
import { toast } from "sonner"
import { CurrencyInfo, DEFAULT_CURRENCY } from "@/lib/currencyTypes"

interface StoreItem {
  id: string
  name: string
  price: number
  currency?: string
  type: string
  description: string
  color?: string[] | string
  image?: string
}

interface StoreData {
  cards: StoreItem[]
  editPlans: StoreItem[]
}

export default function StoreItems() {
  const router = useRouter()
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [userCurrency, setUserCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY)

  const fetchStoreItems = async () => {
    try {
      setLoading(true)
      
      // Get user's preferred currency from localStorage (client-side)
      const storedCurrency = localStorage.getItem('userCurrency');
      if (storedCurrency) {
        try {
          setUserCurrency(JSON.parse(storedCurrency));
        } catch (e) {
          console.error("Failed to parse stored currency", e);
          setUserCurrency(DEFAULT_CURRENCY);
        }
      }
      
      const data = await getStoreItems()
      setStoreData(data)
    } catch (error) {
      console.error("Failed to load store items:", error)
      toast.error("Failed to load store items. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStoreItems()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!storeData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">No store items available at the moment.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="cards" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="cards">Cards</TabsTrigger>
        <TabsTrigger value="editPlans">Edit Plans</TabsTrigger>
      </TabsList>
      
      <TabsContent value="cards" className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeData.cards.map((item) => (
            <StoreItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              currency={item.currency || DEFAULT_CURRENCY.code}
              type={item.type}
              description={item.description}
              color={item.color}
              image={item.image}
            />
          ))}
        </div>
      </TabsContent>
      
      <TabsContent value="editPlans" className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeData.editPlans.map((item) => (
            <StoreItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              currency={item.currency || DEFAULT_CURRENCY.code}
              type={item.type}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
} 