import React from 'react'

const Page = () => {
  return (
    <div className="p-5 w-full h-full">
      <div className="w-full h-48 px-3.5 py-4 bg-white rounded-lg flex-col justify-start items-start gap-5 inline-flex">
        <div className="text-[#383e49] text-xl font-medium">Overall Inventory</div>
        <div className="justify-between items-center inline-flex">
          <div className=" flex-col justify-start items-start gap-3 inline-flex">
            <div className="text-[#156fee] text-base font-semibold ">Categories</div>
            <div className="text-[#5d6679] text-base font-semibold ">14</div>
            <div className="text-[#858d9d] text-sm font-normal ">Last 7 days</div>
          </div>
          <div className="w-[99px] h-[0px] rotate-90 border border-[#f0f1f3]"></div>
          <div className="flex-col justify-start items-start gap-3 inline-flex">
            <div className="text-[#e19133] text-base font-semibold ">Total Products</div>
            <div className="flex-col justify-between items-start gap-3 flex">
              <div className="justify-start items-start gap-[91px] inline-flex">
                <div className="text-[#5d6679] text-base font-semibold ">868</div>
                <div className="text-[#5d6679] text-base font-semibold ">₹25000</div>
              </div>
              <div className="justify-start items-start gap-[47px] inline-flex">
                <div className="text-[#858d9d] text-sm font-normal ">Last 7 days</div>
                <div className="text-[#858d9d] text-sm font-normal ">Revenue</div>
              </div>
            </div>
          </div>
          <div className="w-[99px] h-[0px]  rotate-90 border border-[#f0f1f3]"></div>
          <div className="w-[205px] flex-col justify-start items-start gap-3 inline-flex">
            <div className="text-[#845ebc] text-base font-semibold ">Top Selling</div>
            <div className="flex-col justify-start items-start gap-3 flex">
              <div className="justify-start items-start gap-[139px] inline-flex">
                <div className="text-[#5d6679] text-base font-semibold ">5</div>
                <div className="text-[#5d6679] text-base font-semibold ">₹2500</div>
              </div>
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="text-[#858d9d] text-sm font-normal ">Last 7 days</div>
                <div className="text-[#858d9d] text-sm font-normal ">Cost</div>
              </div>
            </div>
          </div>
          <div className="w-[99px] h-[0px]  rotate-90 border border-[#f0f1f3]"></div>
          <div className="w-[235px] flex-col justify-start items-start gap-3 inline-flex">
            <div className="text-[#f36960] text-base font-semibold ">Low Stocks</div>
            <div className="self-stretch justify-between items-start inline-flex">
              <div className="text-[#5d6679] text-base font-semibold ">12</div>
              <div className="text-[#5d6679] text-base font-semibold ">2</div>
            </div>
            <div className="justify-start items-start gap-[95px] inline-flex">
              <div className="text-[#858d9d] text-sm font-normal ">Ordered</div>
              <div className="text-[#858d9d] text-sm font-normal ">Not in stock</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;