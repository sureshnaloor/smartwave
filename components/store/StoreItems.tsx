"use client"

import StoreItemCard from "./StoreItemCard"

interface StoreItem {
  id: string
  name: string
  price: number
  type: string
  description: string
  color?: string[]
  image?: string
}

interface StoreItemsProps {
  items: StoreItem[]
}

export default function StoreItems({ items }: StoreItemsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <StoreItemCard
          key={item.id}
          id={item.id}
          name={item.name}
          price={item.price}
          type={item.type}
          description={item.description}
          color={item.color}
          image={item.image}
        />
      ))}
    </div>
  )
} 