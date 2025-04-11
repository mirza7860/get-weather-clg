"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, MapPin, ArrowLeft } from "lucide-react"
import Navbar from "@/components/navbar"

interface Location {
  name: string
  latitude: number
  longitude: number
}

export default function SavedLocationsPage() {
  const router = useRouter()
  const [savedLocations, setSavedLocations] = useState<Location[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const saved = localStorage.getItem("savedLocations")
    if (saved) {
      setSavedLocations(JSON.parse(saved))
    }
  }, [])

  const handleLocationClick = (location: Location) => {
    router.push(`/?lat=${location.latitude}&lon=${location.longitude}&name=${encodeURIComponent(location.name)}`)
  }

  const handleRemoveLocation = (e: React.MouseEvent, location: Location) => {
    e.stopPropagation()

    // Remove from localStorage
    const updatedLocations = savedLocations.filter(
      (loc) => loc.latitude !== location.latitude || loc.longitude !== location.longitude,
    )

    setSavedLocations(updatedLocations)
    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations))
  }

  if (!isClient) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">Saved Locations</h1>
        </div>

        {savedLocations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't saved any locations yet.</p>
              <Link href="/">
                <Button>Go to Weather</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedLocations.map((location, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleLocationClick(location)}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium">{location.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleRemoveLocation(e, location)}
                    title="Remove location"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
