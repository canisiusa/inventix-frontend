import { Cost, Profit, Revenue, Sales } from '@/components/icons'
import React from 'react'


const SalesOverview = ({data}: {data: SalesOverview}) => {
  return (
    <div className="w-full h-40 px-4 py-5 bg-white rounded-lg flex-col justify-start items-start gap-7 inline-flex overflow-hidden">
    <div className="self-stretch text-zinc-700 text-xl font-medium">Sales Overview</div>
    <div className="self-stretch justify-between items-center gap-8 inline-flex">
      <div className="flex-col justify-start items-center gap-3 inline-flex">
        <Sales />
        <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
          <div className="text-gray-500 text-base font-semibold">₹ {data.totalSales}</div>
          <div className="text-gray-500 text-sm font-medium">Sales</div>
        </div>
      </div>
      <div className="w-px h-16 border border-gray-100"></div>
      <div className="flex-col justify-start items-center gap-3 inline-flex">
        <Revenue />
        <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
          <div className="text-gray-500 text-base font-semibold">₹ {data.revenue}</div>
          <div className="text-gray-500 text-sm font-medium">Revenue</div>
        </div>
      </div>
      <div className="w-px h-16 border border-gray-100"></div>
      <div className="flex-col justify-start items-center gap-3 inline-flex">
        <Profit />
        <div className="self-stretch justify-start h-6 items-center gap-8 inline-flex">
          <div className="text-gray-500 text-base font-semibold">₹ {data.profit}</div>
          <div className="text-gray-500 text-sm font-medium">Profit</div>
        </div>
      </div>
      <div className="w-px h-16 border border-gray-100"></div>
      <div className="min-w-28 flex-col justify-start items-center gap-3 inline-flex">
        <Cost />
        <div className="self-stretch h-6 justify-between items-center inline-flex">
          <div className="text-gray-500 text-base font-semibold">₹ {data.cost}</div>
          <div className="text-gray-500 text-sm font-medium">Cost</div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SalesOverview