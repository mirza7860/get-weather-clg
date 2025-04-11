"use client"

import { Cloud, CloudSun, CloudRain, Thermometer } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 py-16 md:py-24">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10">
          <Cloud className="h-20 w-20 text-white" />
        </div>
        <div className="absolute top-40 right-20">
          <CloudSun className="h-16 w-16 text-white" />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <CloudRain className="h-14 w-14 text-white" />
        </div>
        <div className="absolute bottom-40 right-1/3">
          <Thermometer className="h-12 w-12 text-white" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Real-Time Weather Forecasts</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get accurate weather data for any location with hourly and 7-day forecasts
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => {
                // Scroll to search section
                const searchSection = document.getElementById("search-section")
                if (searchSection) {
                  searchSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Check Weather
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <CloudSun className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accurate Forecasts</h3>
              <p className="opacity-90">Detailed hourly and 7-day weather predictions</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <Thermometer className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Detailed Metrics</h3>
              <p className="opacity-90">Temperature, precipitation, wind, and more</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <Cloud className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Save Locations</h3>
              <p className="opacity-90">Bookmark your favorite places for quick access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
