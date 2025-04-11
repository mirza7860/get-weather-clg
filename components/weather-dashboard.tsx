"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import CurrentWeather from "./current-weather"
import HourlyForecast from "./hourly-forecast"
import DailyForecast from "./daily-forecast"
import { Star, StarOff } from "lucide-react"

// Import the chart components
import TemperatureChart from "./temperature-chart"
import PrecipitationChart from "./precipitation-chart"
import WindChart from "./wind-chart"
import SevenDayChart from "./seven-day-chart"
import SavedLocations from "./saved-locations"

interface Location {
  name: string
  latitude: number
  longitude: number
}

export default function WeatherDashboard() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savedLocations, setSavedLocations] = useState<Location[]>([])
  const [isSaved, setIsSaved] = useState(false)

  // Get location from URL params or use geolocation
  useEffect(() => {
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const name = searchParams.get("name")

    if (lat && lon && name) {
      setCurrentLocation({
        name: decodeURIComponent(name),
        latitude: Number.parseFloat(lat),
        longitude: Number.parseFloat(lon),
      })
    } else {
      // Use browser geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords

              // Reverse geocode to get location name
              const response = await fetch(
                `https://api.open-meteo.com/v1/geocoding?latitude=${latitude}&longitude=${longitude}&count=1`,
              )
              const data = await response.json()

              let locationName = "Current Location"
              if (data.results && data.results.length > 0) {
                locationName = data.results[0].name
                if (data.results[0].admin1) {
                  locationName += `, ${data.results[0].admin1}`
                }
              }

              setCurrentLocation({
                name: locationName,
                latitude,
                longitude,
              })
            } catch (err) {
              setError("Failed to get location name")
              console.error(err)
            }
          },
          (err) => {
            setError("Geolocation permission denied. Please search for a location.")
            console.error(err)
          },
        )
      } else {
        setError("Geolocation is not supported by your browser")
      }
    }
  }, [searchParams])

  // Load saved locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("savedLocations")
    if (saved) {
      setSavedLocations(JSON.parse(saved))
    }
  }, [])

  // Check if current location is saved
  useEffect(() => {
    if (currentLocation && savedLocations.length > 0) {
      const isSavedLocation = savedLocations.some(
        (loc) => loc.latitude === currentLocation.latitude && loc.longitude === currentLocation.longitude,
      )
      setIsSaved(isSavedLocation)
    }
  }, [currentLocation, savedLocations])

  // Fetch weather data when location changes
  useEffect(() => {
    if (currentLocation) {
      fetchWeatherData(currentLocation.latitude, currentLocation.longitude)
    }
  }, [currentLocation])

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
          `&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant` +
          `&timezone=auto`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSaveLocation = () => {
    if (!currentLocation) return

    if (isSaved) {
      // Remove from saved locations
      const updatedLocations = savedLocations.filter(
        (loc) => loc.latitude !== currentLocation.latitude || loc.longitude !== currentLocation.longitude,
      )
      setSavedLocations(updatedLocations)
      localStorage.setItem("savedLocations", JSON.stringify(updatedLocations))
      setIsSaved(false)
      toast({
        title: "Location removed",
        description: `${currentLocation.name} has been removed from your saved locations.`,
      })
    } else {
      // Add to saved locations
      const updatedLocations = [...savedLocations, currentLocation]
      setSavedLocations(updatedLocations)
      localStorage.setItem("savedLocations", JSON.stringify(updatedLocations))
      setIsSaved(true)
      toast({
        title: "Location saved",
        description: `${currentLocation.name} has been added to your saved locations.`,
      })
    }
  }

  const goToSavedLocations = () => {
    router.push("/saved")
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentLocation || loading || !weatherData) {
    return null // Skeleton is shown via Suspense
  }

  return (
    <div className="mt-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">{currentLocation.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSaveLocation}
            title={isSaved ? "Remove from favorites" : "Save to favorites"}
          >
            {isSaved ? <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-5 w-5" />}
          </Button>
        </CardHeader>
        <CardContent>
          <CurrentWeather data={weatherData} />
        </CardContent>
      </Card>

      <Tabs defaultValue="hourly" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="daily">7-Day</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="hourly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <HourlyForecast data={weatherData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyForecast data={weatherData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="mt-4">
          <div className="space-y-6">
            <TemperatureChart data={weatherData} />
            <PrecipitationChart data={weatherData} />
            <WindChart data={weatherData} />
            <SevenDayChart data={weatherData} />
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Saved Locations</CardTitle>
              <Button variant="outline" size="sm" onClick={goToSavedLocations}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <SavedLocations locations={savedLocations} currentLocation={currentLocation} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
