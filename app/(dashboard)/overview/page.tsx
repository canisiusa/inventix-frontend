"use client"
import React from 'react'
import { Categories, Cost, Profit, Purchase, QtyInHand, Return, Revenue, Sales, Supplier, TobeReceived } from '@/components/icons'
import { Calendar } from 'lucide-react'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import Link from 'next/link'

const page = () => {
  const chartData = [
    { month: "Jan", desktop: 186, mobile: 800 },
    { month: "Feb", desktop: 305, mobile: 2000 },
    { month: "Mar", desktop: 237, mobile: 1200 },
    { month: "Apr", desktop: 73, mobile: 1900 },
    { month: "May", desktop: 209, mobile: 1300 },
    { month: "Jun", desktop: 214, mobile: 1400 },
    { month: "Juil", desktop: 214, mobile: 1400 },
    { month: "Aou", desktop: 214, mobile: 1300 },
    { month: "Sep", desktop: 214, mobile: 1800 },
  ]

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#817AF3",
    },
    mobile: {
      label: "Mobile",
      color: "#46A46C",
    },
  } satisfies ChartConfig
  return (
    <div className='flex gap-5 py-8'>
      <div className='w-2/3 flex flex-col gap-5'>
        {/* Sales Overview */}
        <div className="w-full h-40 px-4 py-5 bg-white rounded-lg flex-col justify-start items-start gap-7 inline-flex overflow-hidden">
          <div className="self-stretch text-zinc-700 text-xl font-medium">Sales Overview</div>
          <div className="self-stretch justify-between items-center gap-8 inline-flex">
            <div className="flex-col justify-start items-center gap-3 inline-flex">
              <Sales />
              <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
                <div className="text-gray-500 text-base font-semibold">₹ 832</div>
                <div className="text-gray-500 text-sm font-medium">Sales</div>
              </div>
            </div>
            <div className="w-px h-16 border border-gray-100"></div>
            <div className="flex-col justify-start items-center gap-3 inline-flex">
              <Revenue />
              <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
                <div className="text-gray-500 text-base font-semibold">₹ 18,300</div>
                <div className="text-gray-500 text-sm font-medium">Revenue</div>
              </div>
            </div>
            <div className="w-px h-16 border border-gray-100"></div>
            <div className="flex-col justify-start items-center gap-3 inline-flex">
              <Profit />
              <div className="self-stretch justify-start h-6 items-center gap-8 inline-flex">
                <div className="text-gray-500 text-base font-semibold">₹ 868</div>
                <div className="text-gray-500 text-sm font-medium">Profit</div>
              </div>
            </div>
            <div className="w-px h-16 border border-gray-100"></div>
            <div className="min-w-28 flex-col justify-start items-center gap-3 inline-flex">
              <Cost />
              <div className="self-stretch h-6 justify-between items-center inline-flex">
                <div className="text-gray-500 text-base font-semibold">₹ 17,432</div>
                <div className="text-gray-500 text-sm font-medium">Cost</div>
              </div>
            </div>
          </div>
        </div>
        {/* Purchase Overview */}
        <div className="w-full h-40 px-4 py-5 bg-white rounded-lg flex-col justify-start items-start gap-7 inline-flex overflow-hidden">
          <div className="self-stretch text-zinc-700 text-xl font-medium">Purchase Overview</div>
          <div className="self-stretch justify-between items-center gap-8 inline-flex">
            <div className="flex-col justify-start items-center gap-3 inline-flex">
              <Purchase />
              <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
                <div className="text-gray-500 text-base font-semibold">82</div>
                <div className="text-gray-500 text-sm font-medium">Purchase</div>
              </div>
            </div>
            <div className="w-px h-16 border border-gray-100"></div>
            <div className="flex-col justify-start items-center gap-3 inline-flex">
              <Cost />
              <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
                <div className="text-gray-500 text-base font-semibold">₹ 13,57</div>
                <div className="text-gray-500 text-sm font-medium">Cost</div>
              </div>
            </div>
            <div className="w-px h-16 border border-gray-100"></div>
            <div className="flex-col justify-start items-center gap-3 inline-flex">
              <Return />
              <div className="self-stretch justify-start h-6 items-center gap-8 inline-flex">
                <div className="text-gray-500 text-base font-semibold">5</div>
                <div className="text-gray-500 text-sm font-medium">Cancel</div>
              </div>
            </div>
            <div className="w-px h-16 border border-gray-100"></div>
            <div className="min-w-28 flex-col justify-start items-center gap-3 inline-flex">
              <Profit />
              <div className="self-stretch h-6 justify-between items-center inline-flex">
                <div className="text-gray-500 text-base font-semibold">₹17,432</div>
                <div className="text-gray-500 text-sm font-medium">Return</div>
              </div>
            </div>
          </div>
        </div>
        {/* Sales & Purchase */}
        <div className="w-full h-96 px-4 py-4 bg-white rounded-lg flex-col justify-start items-center gap-6 inline-flex overflow-hidden">
          <div className="self-stretch justify-between items-center inline-flex">
            <div className="text-zinc-700 text-xl font-medium">Sales & Purchase</div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="px-3 py-1.5 bg-white rounded shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] border border-gray-300 justify-center items-center gap-2 flex overflow-hidden">
                  <Calendar stroke="#5D6679" strokeWidth={1} size={14} />
                  <div className="text-gray-500 text-sm font-medium">Weekly</div>
                </div>
              </DropdownMenuTrigger>
            </DropdownMenu>
          </div>
          <ChartContainer config={chartConfig} className="min-h-64 w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
      <div className="w-1/3 flex flex-col gap-5">
        {/* Inventory Summary */}
        <div className="w-full h-40 px-4 py-1.5 bg-white rounded-lg flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
          <div className="self-stretch text-zinc-700 text-xl font-medium">Inventory Summary</div>
          <div className="justify-between items-start inline-flex w-full">
            <div className="flex-col justify-start items-center gap-2 inline-flex">
              <QtyInHand />
              <div className="flex-col justify-start items-center gap-0.5 flex">
                <div className="text-gray-500 text-base font-semibold">868</div>
                <div className="text-neutral-700 text-sm font-medium">Quantity in Hand</div>
              </div>
            </div>
            <div className="h-20 w-px  border border-gray-100"></div>
            <div className="flex-col justify-start items-center gap-2 inline-flex">
              <TobeReceived />
              <div className="flex-col justify-start items-center gap-0.5 flex">
                <div className="text-gray-500 text-base font-semibold">200</div>
                <div className="text-neutral-700 text-sm font-medium">To be received</div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Summary */}
        <div className="w-full h-40 px-4 py-1.5 bg-white rounded-lg flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
          <div className="self-stretch text-zinc-700 text-xl font-medium">Product Summary</div>
          <div className="justify-between items-start inline-flex w-full">
            <div className="flex-col justify-start items-center gap-2 inline-flex">
              <Supplier />
              <div className="flex-col justify-start items-center gap-0.5 flex">
                <div className="text-gray-500 text-base font-semibold">31</div>
                <div className="text-neutral-700 text-sm font-medium">Number of Suppliers</div>
              </div>
            </div>
            <div className="h-20 w-px  border border-gray-100"></div>
            <div className="flex-col justify-start items-center gap-2 inline-flex">
              <Categories />
              <div className="flex-col justify-start items-center gap-0.5 flex">
                <div className="text-gray-500 text-base font-semibold">21</div>
                <div className="text-neutral-700 text-sm font-medium">Number of Categories</div>
              </div>
            </div>
          </div>
        </div>
        {/* Low Quantity  Stock  */}
        <div className="w-full h-96 px-4 py-1.5 bg-white rounded-lg flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
          <div className="flex gap-2 w-full items-center justify-between">
            <div className="text-zinc-700 text-lg font-medium">Low Quantity  Stock</div>
            <Link href="" className="text-primary hover:underline text-xs font-medium">View All</Link>
          </div>

          <div className="flex flex-col gap-4">
            {Array.from({length:3}).map((value, index) => (
            <div key={index} className="h-[70px] justify-start items-center gap-[26px] inline-flex">
              <img className="w-[60px] h-[70px] rounded" src="https://placehold.co/60x70" />
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <div className="text-[#383e49] text-base font-semibold">Tata Salt</div>
                <div className="text-[#667085] text-sm font-normal">Remaining Quantity : 10 Packet</div>
              </div>
              <div className="mix-blend-multiply justify-start items-start flex">
                <div className="pl-1.5 pr-2 py-0.5 bg-[#feeceb] rounded-2xl justify-center items-center gap-1 flex">
                  <div className="text-center text-[#aa3028] text-xs font-medium">Low</div>
                </div>
              </div>
            </div>

            )) 
            }

          </div>
        </div>
      </div>
    </div>
  )
}

export default page