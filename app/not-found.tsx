'use client'

import Link from 'next/link'
// import Image from 'next/image'
import {CldImage} from 'next-cloudinary'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Illustration */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <CldImage
            src="notfound_mverxg"
            alt="404 Illustration"
            fill
            priority
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="space-x-4">
          <Button
            asChild
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/">
              Go Home
            </Link>
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
} 