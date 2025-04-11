"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getWeatherIcon } from "@/lib/weather-utils"
import { format } from "date-fns"

interface HourlyForecastProps {
  data: any
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
  const [selectedDay, setSelectedDay] = useState(0)

  if (!data || !data.hourly) {
    return <div>No hourly forecast available</div>
  }

  // Group hourly data by day
  const hourlyByDay: any[] = []
  const times = data.hourly.time
  const days = new Set<string>()

  times.forEach((time: string, index: number) => {
    const date = time.split("T")[0]
    if (!days.has(date)) {
      days.add(date)
      hourlyByDay.push({
        date,
        hours: [],
      })
    }

    const dayIndex = Array.from(days).indexOf(date)
    hourlyByDay[dayIndex].hours.push(index)
  })

  // Get day names for tabs
  const dayNames = hourlyByDay.map((day) => {
    const date = new Date(day.date)
    return format(date, "EEE d")
  })

  return (
    <div>
      <Tabs defaultValue="0" onValueChange={(value) => setSelectedDay(Number.parseInt(value))} className="w-full">
        <TabsList className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 mb-4">
          {dayNames.map((day, index) => (
            <TabsTrigger key={index} value={index.toString()}>
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {hourlyByDay.map((day, dayIndex) => (
          <TabsContent key={dayIndex} value={dayIndex.toString()}>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {day.hours.map((hourIndex: number) => {
                  const time = data.hourly.time[hourIndex]
                  const temp = data.hourly.temperature_2m[hourIndex]
                  const weatherCode = data.hourly.weather_code[hourIndex]
                  const isDay = data.hourly.is_day[hourIndex]
                  const precipitation = data.hourly.precipitation[hourIndex]
                  const precipProb = data.hourly.precipitation_probability[hourIndex]

                  const WeatherIcon = getWeatherIcon(weatherCode, isDay)
                  const hourFormatted = format(new Date(time), "h a")

                  return (
                    <div key={hourIndex} className="flex flex-col items-center p-3 rounded-lg border min-w-[80px]">
                      <span className="text-sm font-medium mb-1">{hourFormatted}</span>
                      <WeatherIcon className="h-8 w-8 my-1 text-blue-600 dark:text-blue-400" />
                      <span className="font-bold">{Math.round(temp)}°</span>
                      {precipProb > 0 && (
                        <div className="flex items-center mt-1 text-xs text-blue-600 dark:text-blue-400">
                          <span>{precipProb}%</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
