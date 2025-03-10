"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download } from "lucide-react"

export default function QRCodeGenerator({ user }) {
  const [size, setSize] = useState("medium")

  // In a real app, this would generate an actual QR code
  // For this example, we'll use a placeholder

  const downloadQRCode = () => {
    // In a real app, this would download the QR code as a PNG file
    alert("QR Code download functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border-2 border-blue-200 flex flex-col items-center">
        <div
          className={`
          ${size === "small" ? "w-32 h-32" : size === "medium" ? "w-48 h-48" : "w-64 h-64"}
          bg-gray-100 flex items-center justify-center mb-4
        `}
        >
          <QrCode
            className={`
            ${size === "small" ? "h-16 w-16" : size === "medium" ? "h-24 w-24" : "h-32 w-32"}
            text-blue-600
          `}
          />
        </div>
        <p className="text-sm text-gray-600 text-center">This QR code links to: {user.name}'s SmartWave Profile</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">QR Code Size</label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={downloadQRCode}>
          <Download className="mr-2 h-4 w-4" />
          Download QR Code
        </Button>
      </div>
    </div>
  )
}

