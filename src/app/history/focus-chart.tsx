"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { 
  ChartConfig, 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Configuração de cores e legendas
const chartConfig = {
  tempo: {
    label: "Tempo (minutos)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function FocusChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // O "Efeito" que busca os dados na API assim que o componente nasce
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard")
        const jsonData = await response.json()
        const dailyData = jsonData.daily
        
        // Conversão opcional: transformar segundos em minutos para ficar mais legível
        const formattedData = dailyData.map((item: any) => ({
          ...item,
          day: item.day.slice(0,-1), // Remove o "Z" do final da string ISO
          totalDuration: Math.ceil(item.totalDuration / 60) // De segundos para minutos
        }))

        setData(formattedData)
      } catch (error) {
        console.error("Erro ao buscar dados do gráfico:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Carregando gráfico...</div>
  if (data.length === 0) return null // Não mostra nada se não tiver dados

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Seu Tempo de Foco (Últimos dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-50 w-full">
          {/* AQUI ESTAVA FALTANDO O DATA={DATA} 👇 */}
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            
            <XAxis 
              dataKey="day" 
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' })}
            />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Bar 
              dataKey="totalDuration" 
              fill="var(--color-tempo)" 
              radius={4} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}