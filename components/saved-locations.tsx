"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Trash2 } from "lucide-react"

interface Location {
  name: string
  latitude: number
  longitude: number
}

interface SavedLocationsProps {
  locations: Location[]
  currentLocation: Location
}

export default function SavedLocations({ locations, currentLocation }: SavedLocationsProps) {
  const router = useRouter()

  const handleLocationClick = (location: Location) => {
    router.push(`/?lat=${location.latitude}&lon=${location.longitude}&name=${encodeURIComponent(location.name)}`)
  }

  const handleRemoveLocation = (e: React.MouseEvent, location: Location) => {
    e.stopPropagation()

    // Remove from localStorage
    const updatedLocations = locations.filter(
      (loc) => loc.latitude !== location.latitude || loc.longitude !== location.longitude,
    )

    localStorage.setItem("savedLocations", JSON.stringify(updatedLocations))

    // Force a refresh to update the UI
    window.location.reload()
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">You haven't saved any locations yet.</p>
        <p className="text-sm mt-2">Click the star icon on a location to save it for quick access.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((location, index) => {
        const isCurrentLocation =
          location.latitude === currentLocation.latitude && location.longitude === currentLocation.longitude

        return (
          <Card
            key={index}
            className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
              isCurrentLocation ? "border-blue-500 dark:border-blue-400" : ""
            }`}
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
        )
      })}
    </div>
  )
}
