"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download } from "lucide-react"
import QRCode from 'qrcode'
import { User } from "./types"

interface QRCodeGeneratorProps {
  user: User;
}

export default function QRCodeGenerator({ user }: QRCodeGeneratorProps) {
  const [size, setSize] = useState("medium")
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Function to create vCard format string
  const generateVCardData = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${user.name}`,
      `N:${user.lastName || ''};${user.firstName || ''};${user.middleName || ''};;`,
      `TITLE:${user.title || ''}`, 
      `ORG:${user.company || ''}`,
      `EMAIL;type=WORK:${user.workEmail || ''}`,
      `TEL;type=WORK:${user.workPhone || ''}`,
      `TEL;type=CELL:${user.mobile || ''}`,
      `ADR;type=WORK:;;${user.workStreet || ''};${user.workCity || ''};${user.workState || ''};${user.workZipcode || ''};${user.workCountry || ''}`,
      user.website ? `URL:${user.website}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n')

    return vCardData
  }

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return

      const vCardData = generateVCardData()
      
      try {
        const canvas = canvasRef.current
        const sizeInPixels = size === "small" ? 200 : size === "medium" ? 300 : 400

        await QRCode.toCanvas(canvas, vCardData, {
          width: sizeInPixels,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H'
        })

        setQrDataUrl(canvas.toDataURL('image/png'))
      } catch (err) {
        console.error("Error generating QR code:", err)
      }
    }

    generateQR()
  }, [size, user])

  const downloadQRCode = (format: 'png' | 'print' | 'web') => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.download = `${user.name.replace(/\s+/g, '-')}-qr-${format}.png`
    link.href = qrDataUrl

    // For print quality, create a larger version
    if (format === 'print') {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set high DPI for print
      canvas.width = 1200
      canvas.height = 1200
      
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        link.href = canvas.toDataURL('image/png')
        link.click()
      }
      img.src = qrDataUrl
      return
    }

    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border-2 border-blue-200 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className={`
            ${size === "small" ? "w-[200px] h-[200px]" : size === "medium" ? "w-[300px] h-[300px]" : "w-[400px] h-[400px]"}
            mb-4
          `}
        />
        <p className="text-sm text-gray-600 text-center">
          Scan to add {user.name}'s contact information
        </p>
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

        <div className="space-y-2">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            onClick={() => downloadQRCode('png')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PNG
          </Button>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => downloadQRCode('print')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download for Print (300 DPI)
          </Button>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => downloadQRCode('web')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download for Web
          </Button>
        </div>
      </div>
    </div>
  )
}

