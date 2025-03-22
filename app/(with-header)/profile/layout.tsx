import { ReactNode } from "react"
import { Toaster } from "@/components/ui/toaster"

interface ProfileLayoutProps {
  children: ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  )
} 