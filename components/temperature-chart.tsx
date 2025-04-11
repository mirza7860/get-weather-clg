"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

interface TemperatureChartProps {
  data: any
}

export default function TemperatureChart({ data }: TemperatureChartProps) {
  if (!data || !data.hourly) {
    return null
  }

  // Get today's data only (first 24 hours)
  const chartData = data.hourly.time.slice(0, 24).map((time: string, index: number) => {
    return {
      time: format(new Date(time), "h a"),
      temperature: data.hourly.temperature_2m[index],
      apparentTemperature: data.hourly.apparent_temperature[index],
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature (24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            temperature: {
              label: "Temperature",
              color: "hsl(var(--chart-1))",
            },
            apparentTemperature: {
              label: "Feels Like",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" tickMargin={10} tickFormatter={(value) => value} />
              <YAxis tickFormatter={(value) => `${value}°`} domain={["auto", "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="apparentTemperature"
                stroke="var(--color-apparentTemperature)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
