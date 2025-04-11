import { getWeatherIcon, getWeatherDescription } from "@/lib/weather-utils"

interface CurrentWeatherProps {
  data: any
}

export default function CurrentWeather({ data }: CurrentWeatherProps) {
  if (!data || !data.current) {
    return <div>No weather data available</div>
  }

  const current = data.current
  const units = data.current_units
  const WeatherIcon = getWeatherIcon(current.weather_code, current.is_day)
  const weatherDescription = getWeatherDescription(current.weather_code)

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      <div className="flex flex-col items-center">
        <WeatherIcon className="h-24 w-24 text-blue-600 dark:text-blue-400" />
        <span className="text-4xl font-bold mt-2">
          {Math.round(current.temperature_2m)}
          {units.temperature_2m}
        </span>
        <span className="text-lg text-gray-600 dark:text-gray-300">
          Feels like {Math.round(current.apparent_temperature)}
          {units.apparent_temperature}
        </span>
        <span className="text-md text-gray-500 dark:text-gray-400 mt-1">{weatherDescription}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-4 mt-4 md:mt-0">
        <DetailItem label="Humidity" value={`${current.relative_humidity_2m}${units.relative_humidity_2m}`} />
        <DetailItem label="Wind" value={`${current.wind_speed_10m} ${units.wind_speed_10m}`} />
        <DetailItem label="Pressure" value={`${current.pressure_msl} ${units.pressure_msl}`} />
        <DetailItem label="Cloud Cover" value={`${current.cloud_cover}${units.cloud_cover}`} />
        <DetailItem label="Precipitation" value={`${current.precipitation} ${units.precipitation}`} />
        <DetailItem label="Wind Gusts" value={`${current.wind_gusts_10m} ${units.wind_gusts_10m}`} />
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
