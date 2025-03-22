import { Suspense } from "react"
import Header from "@/components/Header"

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 