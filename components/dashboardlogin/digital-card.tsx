"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Globe, RotateCw, QrCode } from "lucide-react"

export default function DigitalCard({ user }) {
  const [showFront, setShowFront] = useState(true)

  const flipCard = () => {
    setShowFront(!showFront)
  }

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        className={`relative transition-transform duration-500 transform-style-3d w-full h-56 ${
          showFront ? "" : "rotate-y-180"
        }`}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-gradient-to-r from-blue-600 to-red-600 rounded-xl p-6 text-white shadow-lg ${
            showFront ? "" : "hidden"
          }`}
        >
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm opacity-90">{user.title}</p>
              <p className="text-lg font-semibold mt-1">{user.company}</p>
            </div>
            {user.photo ? (
              <Image
                src={user.photo || "/placeholder.svg"}
                alt={user.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-white"
              />
            ) : (
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <p className="flex items-center text-sm">
              <Mail className="h-4 w-4 mr-2" /> {user.email}
            </p>
            <p className="flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2" /> {user.phone}
            </p>
            {user.website && (
              <p className="flex items-center text-sm">
                <Globe className="h-4 w-4 mr-2" /> {user.website}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-2 right-2 text-white/70 hover:text-white"
            onClick={flipCard}
          >
            <RotateCw className="h-4 w-4 mr-1" /> Flip
          </Button>
        </div>

        {/* Back of card */}
        <div
          className={`absolute w-full h-full backface-hidden bg-white rounded-xl p-6 shadow-lg rotate-y-180 ${
            showFront ? "hidden" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-4 text-center">
              <h3 className="text-xl font-bold text-blue-600">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.company}</p>
            </div>

            <div className="w-32 h-32 mb-4">
              {/* QR Code placeholder - in a real app, generate actual QR code */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                <QrCode className="h-16 w-16 text-gray-500" />
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center">Scan to view my digital profile</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={flipCard}
          >
            <RotateCw className="h-4 w-4 mr-1" /> Flip
          </Button>
        </div>
      </div>
    </div>
  )
}

