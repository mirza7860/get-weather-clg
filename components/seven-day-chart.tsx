"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { format } from "date-fns"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

interface SevenDayChartProps {
  data: any
}

export default function SevenDayChart({ data }: SevenDayChartProps) {
  if (!data || !data.daily) {
    return null
  }

  const chartData = data.daily.time.map((time: string, index: number) => {
    return {
      date: format(new Date(time), "EEE"),
      max: data.daily.temperature_2m_max[index],
      min: data.daily.temperature_2m_min[index],
      precipitation: data.daily.precipitation_sum[index],
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Temperature & Precipitation</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            max: {
              label: "Max Temp (°C)",
              color: "hsl(var(--chart-1))",
            },
            min: {
              label: "Min Temp (°C)",
              color: "hsl(var(--chart-2))",
            },
            precipitation: {
              label: "Precipitation (mm)",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" domain={["auto", "auto"]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="max" fill="var(--color-max)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar yAxisId="left" dataKey="min" fill="var(--color-min)" radius={[4, 4, 0, 0]} maxBarSize={30} />
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
