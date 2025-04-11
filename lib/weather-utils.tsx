import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  SunDim,
  CloudSun,
} from "lucide-react"

export function getWeatherIcon(code: number, isDay: number) {
  // Weather codes based on WMO standards used by Open-Meteo
  // https://open-meteo.com/en/docs

  // Clear
  if (code === 0) {
    return isDay ? Sun : SunDim
  }

  // Mainly clear, partly cloudy
  if (code === 1 || code === 2) {
    return CloudSun
  }

  // Overcast
  if (code === 3) {
    return Cloud
  }

  // Fog
  if (code === 45 || code === 48) {
    return CloudFog
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return CloudDrizzle
  }

  // Rain
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    return CloudRain
  }

  // Snow
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return CloudSnow
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return CloudLightning
  }

  // Default
  return Cloud
}

export function getWeatherDescription(code: number) {
  // Weather codes based on WMO standards used by Open-Meteo

  if (code === 0) return "Clear sky"
  if (code === 1) return "Mainly clear"
  if (code === 2) return "Partly cloudy"
  if (code === 3) return "Overcast"
  if (code === 45) return "Fog"
  if (code === 48) return "Depositing rime fog"
  if (code === 51) return "Light drizzle"
  if (code === 53) return "Moderate drizzle"
  if (code === 55) return "Dense drizzle"
  if (code === 56) return "Light freezing drizzle"
  if (code === 57) return "Dense freezing drizzle"
  if (code === 61) return "Slight rain"
  if (code === 63) return "Moderate rain"
  if (code === 65) return "Heavy rain"
  if (code === 66) return "Light freezing rain"
  if (code === 67) return "Heavy freezing rain"
  if (code === 71) return "Slight snow fall"
  if (code === 73) return "Moderate snow fall"
  if (code === 75) return "Heavy snow fall"
  if (code === 77) return "Snow grains"
  if (code === 80) return "Slight rain showers"
  if (code === 81) return "Moderate rain showers"
  if (code === 82) return "Violent rain showers"
  if (code === 85) return "Slight snow showers"
  if (code === 86) return "Heavy snow showers"
  if (code === 95) return "Thunderstorm"
  if (code === 96) return "Thunderstorm with slight hail"
  if (code === 99) return "Thunderstorm with heavy hail"

  return "Unknown"
}
