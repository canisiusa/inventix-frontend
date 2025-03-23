import { Categories, Supplier } from '@/components/icons'
import React from 'react'

const ProductSummary = ({data}:{data:ProductSummary}) => {
  return (
    <div className="w-full h-40 px-4 py-1.5 bg-white rounded-lg flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
      <div className="self-stretch text-zinc-700 text-xl font-medium">Product Summary</div>
      <div className="justify-between items-start inline-flex w-full">
        <div className="flex-col justify-start items-center gap-2 inline-flex">
          <Supplier />
          <div className="flex-col justify-start items-center gap-0.5 flex">
            <div className="text-gray-500 text-base font-semibold">{data.numberOfSuppliers}</div>
            <div className="text-neutral-700 text-sm font-medium">Number of Suppliers</div>
          </div>
        </div>
        <div className="h-20 w-px  border border-gray-100"></div>
        <div className="flex-col justify-start items-center gap-2 inline-flex">
          <Categories />
          <div className="flex-col justify-start items-center gap-0.5 flex">
            <div className="text-gray-500 text-base font-semibold">{data.numberOfCategories}</div>
            <div className="text-neutral-700 text-sm font-medium">Number of Categories</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSummary