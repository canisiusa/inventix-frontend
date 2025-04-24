"use client"
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getOverviewChartData } from '@/lib/api/overviewApi'
import { useLocalization } from '@/providers/localization-provider'
import { handleError } from '@/lib/utils'

// Définition du type des données attendues
type SalesData = {
  period: string;
  sales: number;
  purchases: number;
};

const SalesAndPurcharseChart = () => {
  const [chartData, setChartData] = useState<SalesData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'weekly'>('monthly')

  const { t } = useLocalization()

  useEffect(() => {
    fetchSalesData()
  }, [selectedPeriod])

  const fetchSalesData = async () => {
    try {
      const queryParams = { period: selectedPeriod }
      const res = await getOverviewChartData(queryParams)

      if (res.status === "success" && Array.isArray(res.data)) {
        setChartData(
          res.data.map(({ period, sales, purchases }) => ({
            period: period,  // Nom du mois ou de la semaine
            sales: sales,   // Alias pour les ventes
            purchases: purchases // Alias pour les achats
          }))
        )
      } else {
        throw res.data
      }
    } catch (error) {
      handleError({ error, message: "Error fetching sales data", dict: t })
    }
  }

  const chartConfig = {
    sales: {
      label: "Ventes",
      color: "#817AF3",
    },
    purchases: {
      label: "Achats",
      color: "#46A46C",
    },

  } satisfies ChartConfig

  return (
    <div className="w-full h-96 px-4 py-4 bg-white rounded-lg flex-col justify-start items-center gap-6 inline-flex overflow-hidden">
      <div className="self-stretch justify-between items-center inline-flex">
        <div className="text-zinc-700 text-xl font-medium">Sales & Purchase</div>


        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'monthly' | 'weekly')}>
          <SelectTrigger className="w-[150px] border-gray-300 shadow-sm">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensuel</SelectItem>
            <SelectItem value="weekly">Hebdomadaire</SelectItem>
          </SelectContent>
        </Select>

      </div>

      <ChartContainer config={chartConfig} className="min-h-64 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value/* .slice(0, 3) */}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="sales" fill="#817AF3" radius={4} />
          <Bar dataKey="purchases" fill="#46A46C" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

export default SalesAndPurcharseChart
