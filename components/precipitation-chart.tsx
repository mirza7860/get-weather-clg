"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

interface PrecipitationChartProps {
  data: any
}

export default function PrecipitationChart({ data }: PrecipitationChartProps) {
  if (!data || !data.hourly) {
    return null
  }

  // Get today's data only (first 24 hours)
  const chartData = data.hourly.time.slice(0, 24).map((time: string, index: number) => {
    return {
      time: format(new Date(time), "h a"),
      probability: data.hourly.precipitation_probability[index],
      precipitation: data.hourly.precipitation[index],
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Precipitation (24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            probability: {
              label: "Probability (%)",
              color: "hsl(var(--chart-3))",
            },
            precipitation: {
              label: "Amount (mm)",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="time" tickMargin={10} tickFormatter={(value) => value} />
              <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}mm`} domain={[0, "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                yAxisId="left"
                dataKey="probability"
                fill="var(--color-probability)"
                radius={[4, 4, 0, 0]}
                maxBarSize={20}
              />
              <Bar
                yAxisId="right"
                dataKey="precipitation"
                fill="var(--color-precipitation)"
                radius={[4, 4, 0, 0]}
                maxBarSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
