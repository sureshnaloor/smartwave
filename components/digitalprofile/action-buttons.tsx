"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, QrCode, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileData, BaseComponentProps } from "./types"

interface ActionButtonsProps extends BaseComponentProps {
  profileData: ProfileData
}

export function ActionButtons({ profileData, theme }: ActionButtonsProps) {
  const [qrDialogOpen, setQrDialogOpen] = useState(false)

  // Function to generate vCard data
  const generateVCard = () => {
    const { personal, work, home, dates } = profileData
    const fullName = `${personal.firstName} ${personal.middleName ? personal.middleName + " " : ""}${personal.lastName}`

    let vcard = `BEGIN:VCARD
VERSION:3.0
FN:${fullName}
N:${personal.lastName};${personal.firstName};${personal.middleName || ""};;
ORG:${profileData.company.name}
`

    if (work.position) {
      vcard += `TITLE:${work.position}\n`
    }

    vcard += `EMAIL;type=WORK:${work.email}
TEL;type=WORK:${work.phone}
ADR;type=WORK:;;${work.address};${work.city};${work.state};${work.zip};${work.country}
`

    vcard += `EMAIL;type=HOME:${home.email}
TEL;type=HOME:${home.phone}
ADR;type=HOME:;;${home.address};${home.city};${home.state};${home.zip};${home.country}
`

    if (dates.birthday) {
      const bday = new Date(dates.birthday)
      const year = bday.getFullYear()
      const month = String(bday.getMonth() + 1).padStart(2, "0")
      const day = String(bday.getDate()).padStart(2, "0")
      vcard += `BDAY:${year}${month}${day}\n`
    }

    // Add social profiles
    Object.entries(profileData.social).forEach(([platform, url]) => {
      if (url) {
        vcard += `URL;type=${platform.toUpperCase()}:${url}\n`
      }
    })

    vcard += "END:VCARD"
    return vcard
  }

  // Function to download vCard
  const downloadVCard = () => {
    const vcard = generateVCard()
    const blob = new Blob([vcard], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const fullName = `${profileData.personal.firstName}_${profileData.personal.lastName}`

    a.href = url
    a.download = `${fullName.toLowerCase()}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Function to add to contacts
  const addToContacts = () => {
    downloadVCard()
  }

  if (theme === "minimal" || theme === "modern") {
    return (
      <>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => setQrDialogOpen(true)} variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
          <Button onClick={downloadVCard} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download vCard
          </Button>
          <Button onClick={addToContacts} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add to Contacts
          </Button>
        </div>

        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="h-64 w-64 bg-muted">
                {/* Placeholder for QR code - in a real implementation, you would generate a QR code here */}
                <div className="flex h-full w-full items-center justify-center">
                  <QrCode className="h-32 w-32 text-muted-foreground/50" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Scan this QR code to download the contact information
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (theme === "bold") {
    return (
      <>
        <Card className="border-2 border-indigo-200 p-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => setQrDialogOpen(true)} variant="outline" className="gap-2 border-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </Button>
            <Button onClick={downloadVCard} variant="outline" className="gap-2 border-2">
              <Download className="h-4 w-4" />
              Download vCard
            </Button>
            <Button onClick={addToContacts} className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-600">
              <UserPlus className="h-4 w-4" />
              Add to Contacts
            </Button>
          </div>
        </Card>

        <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="h-64 w-64 bg-muted">
                {/* Placeholder for QR code - in a real implementation, you would generate a QR code here */}
                <div className="flex h-full w-full items-center justify-center">
                  <QrCode className="h-32 w-32 text-muted-foreground/50" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Scan this QR code to download the contact information
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Default "classic" theme
  return (
    <>
      <Card className="p-4">
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => setQrDialogOpen(true)} variant="outline" className="gap-2">
            <QrCode className="h-4 w-4" />
            QR Code
          </Button>
          <Button onClick={downloadVCard} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download vCard
          </Button>
          <Button onClick={addToContacts} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add to Contacts
          </Button>
        </div>
      </Card>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="h-64 w-64 bg-muted">
              {/* Placeholder for QR code - in a real implementation, you would generate a QR code here */}
              <div className="flex h-full w-full items-center justify-center">
                <QrCode className="h-32 w-32 text-muted-foreground/50" />
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Scan this QR code to download the contact information
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

