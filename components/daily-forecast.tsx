import { getWeatherIcon } from "@/lib/weather-utils"
import { format } from "date-fns"

interface DailyForecastProps {
  data: any
}

export default function DailyForecast({ data }: DailyForecastProps) {
  if (!data || !data.daily) {
    return <div>No daily forecast available</div>
  }

  const daily = data.daily
  const units = data.daily_units

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
      {daily.time.map((time: string, index: number) => {
        const date = new Date(time)
        const dayName = format(date, "EEE")
        const dayDate = format(date, "MMM d")
        const maxTemp = Math.round(daily.temperature_2m_max[index])
        const minTemp = Math.round(daily.temperature_2m_min[index])
        const weatherCode = daily.weather_code[index]
        const precipProb = daily.precipitation_probability_max[index]
        const precipSum = daily.precipitation_sum[index]

        const WeatherIcon = getWeatherIcon(weatherCode, 1) // Use day icon for daily forecast

        return (
          <div
            key={index}
            className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="font-medium">{dayName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{dayDate}</div>

            <WeatherIcon className="h-10 w-10 my-2 text-blue-600 dark:text-blue-400" />

            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold">{maxTemp}°</span>
              <span className="text-gray-500 dark:text-gray-400">{minTemp}°</span>
            </div>

            {precipProb > 0 && (
              <div className="mt-2 text-sm">
                <span className="text-blue-600 dark:text-blue-400">
                  {precipProb}% • {precipSum} {units.precipitation_sum}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
