"use client"

import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { usePathname } from "next/navigation"
import EmployeeFirstLoginRedirect from "@/components/EmployeeFirstLoginRedirect"

export default function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <EmployeeFirstLoginRedirect />
      <Header />
      <main className={`flex-1 ${isHomePage ? '' : 'pt-24 md:pt-32'}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}