'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {CldImage} from 'next-cloudinary'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Error Illustration */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <CldImage
            src="errorpage_sdfade"
            alt="Error Illustration"
            fill
            priority
            className="object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>

        <div className="space-x-4">
          <Button
            onClick={() => reset()}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>

          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
          >
            Go Home
          </Button>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700 font-mono">
              {error.message || 'An unexpected error occurred'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 