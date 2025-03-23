import { QtyInHand, TobeReceived } from '@/components/icons'
import React from 'react'

const InventorySummary = ({data}:{data:InventorySummary}) => {
  return (
    <div className="w-full h-40 px-4 py-1.5 bg-white rounded-lg flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
      <div className="self-stretch text-zinc-700 text-xl font-medium">Inventory Summary</div>
      <div className="justify-between items-start inline-flex w-full">
        <div className="flex-col justify-start items-center gap-2 inline-flex">
          <QtyInHand />
          <div className="flex-col justify-start items-center gap-0.5 flex">
            <div className="text-gray-500 text-base font-semibold">{data.quantityInHand}</div>
            <div className="text-neutral-700 text-sm font-medium">Quantity in Hand</div>
          </div>
        </div>
        <div className="h-20 w-px  border border-gray-100"></div>
        <div className="flex-col justify-start items-center gap-2 inline-flex">
          <TobeReceived />
          <div className="flex-col justify-start items-center gap-0.5 flex">
            <div className="text-gray-500 text-base font-semibold">{data.toBeReceived}</div>
            <div className="text-neutral-700 text-sm font-medium">To be received</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InventorySummary