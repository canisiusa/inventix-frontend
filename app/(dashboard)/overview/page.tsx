"use client"

import React, { useEffect, useState } from 'react'
import { getOverview } from '@/lib/api/overviewApi'
import SalesOverview from './_components/SalesOverview'
import PurchaseOverview from './_components/PurchaseOverview'
import SalesAndPurcharseChart from './_components/SalesAndPurcharseChart'
import InventorySummary from './_components/InventorySummary'
import ProductSummary from './_components/ProductSummary'
import LowQtyStock from './_components/LowQtyStock'
import { handleError } from '@/lib/utils'
import { useLocalization } from '@/providers/localization-provider'


const OverviewPage = () => {
  const [overviewData, setOverviewData] = useState<Overview | null>(null)

  const {t} = useLocalization()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await getOverview()
      if (res.status === "success") {
        setOverviewData(res.data)
      } else {
        throw res.data
      }
    } catch(error) {
      handleError({error, message: "Failed to fetch data", dict: t })
    }
  }

  if (!overviewData) return <div className="text-center py-8">Loading...</div>

  return (
    <div className='flex gap-5 py-8'>
      <div className='w-2/3 flex flex-col gap-5'>
        <SalesOverview data={overviewData.salesOverview} />
        <PurchaseOverview data={overviewData.purchaseOverview} />
        <SalesAndPurcharseChart />
      </div>
      <div className="w-1/3 flex flex-col gap-5">
        <InventorySummary data={overviewData.inventorySummary} />
        <ProductSummary data={overviewData.productSummary} />
        <LowQtyStock />
      </div>
    </div>
  )
}

export default OverviewPage
