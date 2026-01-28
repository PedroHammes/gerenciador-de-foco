"use client"

import { useEffect, useState } from "react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Tempo",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function CategoryRadar() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard")
        const jsonData = await response.json()
        
        // 1. Qual parte do JSON novo nós queremos aqui? (daily ou categories?)
        const categoryData = jsonData.categories

        // Vamos converter segundos para minutos, igual fizemos antes
        const formattedData = categoryData.map((item: any) => ({
          ...item,
          totalDuration: Math.ceil(item.totalDuration / 60)
        }))

        setData(formattedData)
      } catch (error) {
        console.error("Erro ao carregar radar:", error)
      }
    }

    fetchData()
  }, [])

  if (data.length === 0) return null

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Foco por Categoria</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-64"
        >
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid />
            
            {/* O "Eixo X" circular: Onde ficam os nomes das tags? */}
            <PolarAngleAxis dataKey="category" />
            
            {/* O desenho preenchido: Onde fica o valor numérico? */}
            <Radar
              dataKey="totalDuration"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}