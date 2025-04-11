import { Suspense } from "react"
import WeatherDashboard from "@/components/weather-dashboard"
import SearchLocation from "@/components/search-location"
import { Skeleton } from "@/components/ui/skeleton"
import LandingSection from "@/components/landing-section"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <LandingSection />

      <div id="search-section" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800 dark:text-blue-300">
          Search Weather by Location
        </h2>

        <SearchLocation />

        <Suspense fallback={<WeatherSkeleton />}>
          <WeatherDashboard />
        </Suspense>
      </div>
    </main>
  )
}

function WeatherSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <Skeleton className="h-12 w-48 mb-4" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-6 w-16 mb-2" />
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-5 w-12" />
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col items-center p-3 border rounded-lg">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-12 w-12 rounded-full mb-2" />
                <Skeleton className="h-5 w-16 mb-1" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
