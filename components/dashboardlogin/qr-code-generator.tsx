"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download } from "lucide-react"
import QRCode from 'qrcode'
import Image from 'next/image'
import { ProfileData } from "@/app/actions/profile"

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

        // Create a temporary canvas for high-res logo
        const logoCanvas = document.createElement('canvas')
        logoCanvas.width = actualLogoSize
        logoCanvas.height = actualLogoSize
        const logoCtx = logoCanvas.getContext('2d')
        if (!logoCtx) return

        // Draw logo at higher resolution
        logoCtx.drawImage(img, 0, 0, actualLogoSize, actualLogoSize)

        // Create a white background for the logo
        ctx.fillStyle = 'white'
        ctx.fillRect(logoX - 2, logoY - 2, displayLogoSize + 4, displayLogoSize + 4)

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
    <div className="w-full flex justify-center">
      <div className="w-[80%] flex justify-between">
        <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
          <canvas
            ref={canvasRef}
            className={`
              ${size === "small" ? "w-[200px] h-[200px]" : size === "medium" ? "w-[300px] h-[300px]" : "w-[400px] h-[400px]"}
            `}
          />
          <p className="text-sm text-gray-600 text-center mt-4">
            Scan to add {user.name}'s contact information
          </p>
        </div>

        <div className="mt-6 w-full max-w-[300px]">
          <div className="flex items-center justify-between mb-4">
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
              Download for Print
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
    </div>
  )
}

