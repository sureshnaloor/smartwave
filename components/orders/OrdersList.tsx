"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserPreferences } from "@/app/_actions/user-preferences"
import { toast } from "sonner"
import { Package } from "lucide-react"
import { format } from "date-fns"

interface OrderItem {
  productId: string
  name: string
  price: number
  type: string
  quantity: number
  color?: string
  image?: string
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userPrefs = await getUserPreferences()
        if (userPrefs?.orders) {
          setOrders(userPrefs.orders as Order[])
        }
      } catch (error) {
        console.error("Failed to load orders:", error)
        toast.error("Failed to load your orders. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Once you place an order, it will appear here</p>
            <Button onClick={() => window.location.href = "/store"}>
              Browse Store
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Format the date string
  const formatOrderDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                <CardDescription>
                  Placed on {formatOrderDate(order.date)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex flex-col sm:flex-row gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="sm:w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <Package className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity} 
                      {item.color && ` • ${item.color}`}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 