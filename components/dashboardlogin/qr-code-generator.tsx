"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download } from "lucide-react"
import QRCode from 'qrcode'
import Image from 'next/image'
import { ProfileData } from "@/app/_actions/profile"

interface QRCodeGeneratorProps {
  user: ProfileData;
}

export default function QRCodeGenerator({ user }: QRCodeGeneratorProps) {
  const [size, setSize] = useState("medium")
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [logoLoaded, setLogoLoaded] = useState(false)

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

  const drawLogoOnQR = (canvas: HTMLCanvasElement, logoUrl: string | undefined) => {
    return new Promise<void>((resolve) => {
      if (!logoUrl) {
        resolve()
        return
      }
  
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve()
        return
      }
  
      const img = document.createElement('img')
      img.crossOrigin = "anonymous"
      img.onload = () => {
        // Calculate logo size (15% of QR code size with 2x DPI scaling)
        const dpiScale = 2
        const displayLogoSize = canvas.width * 0.15 // Smaller visible size (15%)
        const actualLogoSize = displayLogoSize * dpiScale // Actual size for higher DPI
        const logoX = (canvas.width - displayLogoSize) / 2
        const logoY = (canvas.height - displayLogoSize) / 2
  
        // Add padding (20% of logo size) for white background
        const padding = displayLogoSize * 0.2
        const backgroundSize = displayLogoSize + (padding * 2)
        const backgroundX = logoX - padding
        const backgroundY = logoY - padding
  
        // Create a temporary canvas for high-res logo
        const logoCanvas = document.createElement('canvas')
        logoCanvas.width = actualLogoSize
        logoCanvas.height = actualLogoSize
        const logoCtx = logoCanvas.getContext('2d')
        if (!logoCtx) return
  
        // Draw logo at higher resolution
        logoCtx.drawImage(img, 0, 0, actualLogoSize, actualLogoSize)
  
        // Create a white background with rounded corners for the logo
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.roundRect(backgroundX, backgroundY, backgroundSize, backgroundSize, 8)
        ctx.fill()
  
        // Draw the high-res logo scaled down
        ctx.drawImage(logoCanvas, logoX, logoY, displayLogoSize, displayLogoSize)
        setLogoLoaded(true)
        resolve()
      }
      img.onerror = () => {
        console.error("Error loading logo")
        resolve()
      }
      img.src = logoUrl
    })
  }

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return

      const vCardData = generateVCardData()
      
      try {
        const canvas = canvasRef.current
        const sizeInPixels = size === "small" ? 200 : size === "medium" ? 300 : 400

        // Generate QR code with extra error correction and quiet zone for logo
        await QRCode.toCanvas(canvas, vCardData, {
          width: sizeInPixels,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H', // Highest error correction for logo overlay
        })

        // Only add logo for display and web/standard downloads
        if (user.companyLogo) {
          await drawLogoOnQR(canvas, user.companyLogo)
        }

        setQrDataUrl(canvas.toDataURL('image/png'))
      } catch (err) {
        console.error("Error generating QR code:", err)
      }
    }

    generateQR()
  }, [size, user])

  const downloadQRCode = async (format: 'png' | 'print' | 'web') => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.download = `${user.name.replace(/\s+/g, '-')}-qr-${format}.png`

    // For print quality, create a version without logo
    if (format === 'print') {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 1200
      canvas.height = 1200
      
      // Generate high-res QR code without logo for print
      await QRCode.toCanvas(canvas, generateVCardData(), {
        width: canvas.width,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H'
      })

      link.href = canvas.toDataURL('image/png')
    } else {
      // Use the version with logo for web and standard downloads
      link.href = qrDataUrl
    }

    link.click()
  }

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* QR Code Display Section */}
        <div className="w-full flex flex-col items-center">
          <div className="bg-white p-4 sm:p-6 rounded-lg border-2 border-blue-200 shadow-sm w-full max-w-[400px]">
            <canvas
              ref={canvasRef}
              className={`
                w-full aspect-square
                ${size === "small" ? "max-w-[200px]" : size === "medium" ? "max-w-[300px]" : "max-w-[400px]"}
                mx-auto
              `}
            />
            <p className="text-sm text-gray-600 text-center mt-4">
              Scan to add {user.name}'s contact information
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-sm font-medium text-gray-700">QR Code Size</label>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2" 
              onClick={() => downloadQRCode('png')}
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </Button>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              onClick={() => downloadQRCode('print')}
            >
              <Download className="h-4 w-4" />
              <span>Download for Print</span>
            </Button>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              onClick={() => downloadQRCode('web')}
            >
              <Download className="h-4 w-4" />
              <span>Download for Web</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

