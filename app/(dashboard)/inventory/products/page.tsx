import React from 'react'
import InventoryProducts from './_components/InventoryProducts';
import OverallInventory from './_components/OverallInventory';

const Page = () => {
  return (
    <div className="p-5 w-full h-full flex flex-col gap-5">
      <div className="w-full h-48 px-3.5 py-4 bg-white rounded-lg flex-col justify-start items-start gap-5 inline-flex">
        <div className="text-[#383e49] text-xl font-medium">Overall Inventory</div>
        <OverallInventory />
      </div>

      <div className=" w-full overflow- justify-center">
        <div className=" p-2 bg-white rounded-t-lg  border-b-0  border-gray-200 w-full">
          <InventoryProducts />
        </div>
      </div>
    </div>
  )
}

export default Page;