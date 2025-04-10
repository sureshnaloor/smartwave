"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserPreferences } from "@/app/_actions/user-preferences"
import { toast } from "sonner"
import { PackageCheck, ShoppingBag } from "lucide-react"

import { useCountry } from '@/context/CountryContext'
import { currencyConfig } from '@/lib/currencyConfig'
import Image from "next/image"
import { format } from "date-fns"

interface OrderItem {
  productId: string
  name: string
  price: number
  currency?: string
  type: string
  quantity: number
  color?: string
  image?: string
}

// Update the Order interface status types
interface Order {
  id: string
  date: string
  status: "address_added" | "paid" | "processing" | "in_transit" | "delivered"
  items: OrderItem[]
  total: number
  shippingAddress?: {
    fullName?: string
    address?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

export default function OrderItems() {
  const router = useRouter()
  const { selectedCountry } = useCountry();
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})

  const fetchOrders = async () => {
    try {
      const userPrefs = await getUserPreferences()
      if (userPrefs?.orders) {
        setOrders(userPrefs.orders as Order[])
      }
    } catch (error) {
      // console.error("Failed to load orders:", error)
      toast.error("Failed to load your orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number): string => {
    const currencyData = currencyConfig[selectedCountry.currency] || currencyConfig.USD;
    return currencyData.position === 'before'
      ? `${currencyData.symbol}${price.toFixed(2)}`
      : `${price.toFixed(2)} ${currencyData.symbol}`;
  };

  useEffect(() => {
    fetchOrders()
  }, [])

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  // Update the status color function
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "address_added":
        return "bg-blue-100 text-blue-800"
      case "paid":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "in_transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Update the status display text
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "address_added":
        return "Shipping Address Added"
      case "paid":
        return "Payment Completed"
      case "processing":
        return "Processing"
      case "in_transit":
        return "Under Transit"
      case "delivered":
        return "Delivered"
      default:
        return "Unknown Status"
    }
  }
  
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
            <PackageCheck className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Once you place an order, it will appear here</p>
            <Button onClick={() => router.push("/store")}>
              Browse Store
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id.slice(-8)}</p>
                <p className="text-sm text-gray-500">
                  {order.date ? format(new Date(order.date), 'MMM d, yyyy') : 'No date'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <p className="font-medium">{formatPrice(order.total)}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <p className="font-medium">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => toggleOrderDetails(order.id)}
              >
                {expandedOrders[order.id] ? 'Hide details' : 'Show details'}
              </Button>
            </div>
            
            {expandedOrders[order.id] && (
              <div className="space-y-4 mt-4">
                {order.items.map((item) => (
                  <div key={`${order.id}-${item.productId}`} className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.color && (
                          <span className="capitalize">{item.color} • </span>
                        )}
                        <span className="capitalize">{item.type.replace(/_/g, ' ')}</span>
                      </p>
                      <p className="text-sm">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                
                <hr className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
         
        </Card>
      ))}
    </div>
  )
}