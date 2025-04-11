"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// Update the LocationResult interface to match the API response
interface LocationResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
  admin2?: string
}

export default function SearchLocation() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<LocationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)

  // Update the searchLocations function to use the correct endpoint
  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=10&language=en&format=json`,
      )
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error("Error searching locations:", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocations(query)
    setOpen(true)
  }

  // Update the selectLocation function to handle the new response format
  const selectLocation = (location: LocationResult) => {
    // Construct location name with available admin fields
    let locationName = location.name

    if (location.admin2) {
      locationName += `, ${location.admin2}`
    } else if (location.admin1) {
      locationName += `, ${location.admin1}`
    }

    if (location.country && (!location.admin1 || locationName.indexOf(location.country) === -1)) {
      locationName += `, ${location.country}`
    }

    setQuery(locationName)
    setOpen(false)

    // Navigate to the weather page with the selected location
    router.push(`/?lat=${location.latitude}&lon=${location.longitude}&name=${encodeURIComponent(locationName)}`)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
            ref={setInputRef}
          />
          <Button type="submit" className="ml-2" disabled={query.trim().length < 2 || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="sr-only">Search</span>
          </Button>
        </div>

        {open && results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="max-h-60 overflow-auto p-1">
              {results.map((location) => {
                // Format location display name
                let displayName = location.name

                if (location.admin2) {
                  displayName += `, ${location.admin2}`
                }

                if (location.admin1) {
                  displayName += `, ${location.admin1}`
                }

                if (location.country) {
                  displayName += ` (${location.country})`
                }

                return (
                  <div
                    key={`${location.id}`}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => selectLocation(location)}
                  >
                    {displayName}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {open && results.length === 0 && !loading && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
            No locations found
          </div>
        )}

        {open && loading && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-center">
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            <span className="text-sm mt-1">Searching...</span>
          </div>
        )}
      </form>
    </div>
  )
}
