import { Cost, Profit, Purchase, Return } from "@/components/icons";

const PurchaseOverview = ({data}:{data:PurchaseOverview}) => {
  return <div className="w-full h-40 px-4 py-5 bg-white rounded-lg flex-col justify-start items-start gap-7 inline-flex overflow-hidden">
    <div className="self-stretch text-zinc-700 text-xl font-medium">Purchase Overview</div>
    <div className="self-stretch justify-between items-center gap-8 inline-flex">
      <div className="flex-col justify-start items-center gap-3 inline-flex">
        <Purchase />
        <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
          <div className="text-gray-500 text-base font-semibold">{data.totalPurchases}</div>
          <div className="text-gray-500 text-sm font-medium">Purchase</div>
        </div>
      </div>
      <div className="w-px h-16 border border-gray-100"></div>
      <div className="flex-col justify-start items-center gap-3 inline-flex">
        <Cost />
        <div className="self-stretch h-6 justify-start items-center gap-8 inline-flex">
          <div className="text-gray-500 text-base font-semibold">₹ {data.cost}</div>
          <div className="text-gray-500 text-sm font-medium">Cost</div>
        </div>
      </div>
      <div className="w-px h-16 border border-gray-100"></div>
      <div className="flex-col justify-start items-center gap-3 inline-flex">
        <Return />
        <div className="self-stretch justify-start h-6 items-center gap-8 inline-flex">
          <div className="text-gray-500 text-base font-semibold">{data.cancelled}</div>
          <div className="text-gray-500 text-sm font-medium">Cancel</div>
        </div>
      </div>
      <div className="w-px h-16 border border-gray-100"></div>
      <div className="min-w-28 flex-col justify-start items-center gap-3 inline-flex">
        <Profit />
        <div className="self-stretch h-6 justify-between items-center inline-flex">
          <div className="text-gray-500 text-base font-semibold">₹{data.returned}</div>
          <div className="text-gray-500 text-sm font-medium">Return</div>
        </div>
      </div>
    </div>
  </div>
}

export default PurchaseOverview;