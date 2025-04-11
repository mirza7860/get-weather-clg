"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

interface WindChartProps {
  data: any
}

export default function WindChart({ data }: WindChartProps) {
  if (!data || !data.hourly) {
    return null
  }

  // Get today's data only (first 24 hours)
  const chartData = data.hourly.time.slice(0, 24).map((time: string, index: number) => {
    return {
      time: format(new Date(time), "h a"),
      windSpeed: data.hourly.wind_speed_10m[index],
      windGusts: data.hourly.wind_gusts_10m[index],
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wind Speed (24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            windSpeed: {
              label: "Wind Speed",
              color: "hsl(var(--chart-5))",
            },
            windGusts: {
              label: "Wind Gusts",
              color: "hsl(var(--chart-6))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" tickMargin={10} tickFormatter={(value) => value} />
              <YAxis tickFormatter={(value) => `${value} km/h`} domain={[0, "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="windSpeed"
                stroke="var(--color-windSpeed)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="windGusts"
                stroke="var(--color-windGusts)"
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
