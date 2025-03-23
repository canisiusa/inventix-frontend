
import { getOverallInventory } from '@/lib/server-actions/products';

export default async function OverallInventory() {
  const { data, status } = await getOverallInventory();

  if (status === 'failure') {
    return <div className="text-red-500">Erreur de chargement des données</div>;
  }

  return (
    <div className="justify-between items-center inline-flex w-full">
      {/* Categories */}
      <div className="flex-col justify-start items-start gap-3 inline-flex">
        <div className="text-[#156fee] text-base font-semibold">Categories</div>
        <div className="text-[#5d6679] text-base font-semibold">{data.categories}</div>
        <div className="text-[#858d9d] text-sm font-normal">Last 7 days</div>
      </div>

      <div className="w-[99px] h-[0px] rotate-90 border border-[#f0f1f3]"></div>

      {/* Total Products + Revenue */}
      <div className="flex-col justify-start items-start gap-3 inline-flex">
        <div className="text-[#e19133] text-base font-semibold">Total Products</div>
        <div className="flex-col justify-between items-start gap-3 flex">
          <div className="justify-start items-start gap-[91px] inline-flex">
            <div className="text-[#5d6679] text-base font-semibold">{data.totalProducts}</div>
            <div className="text-[#5d6679] text-base font-semibold">₹{data.revenue}</div>
          </div>
          <div className="justify-start items-start gap-[47px] inline-flex">
            <div className="text-[#858d9d] text-sm font-normal">Last 7 days</div>
            <div className="text-[#858d9d] text-sm font-normal">Revenue</div>
          </div>
        </div>
      </div>

      <div className="w-[99px] h-[0px] rotate-90 border border-[#f0f1f3]"></div>

      {/* Top Selling */}
      <div className="w-[205px] flex-col justify-start items-start gap-3 inline-flex">
        <div className="text-[#845ebc] text-base font-semibold">Top Selling</div>
        <div className="flex-col justify-start items-start gap-3 flex">
          <div className="justify-start items-start gap-[139px] inline-flex">
            <div className="text-[#5d6679] text-base font-semibold">{data.topSelling}</div>
            <div className="text-[#5d6679] text-base font-semibold">₹{data.topSellingCost}</div>
          </div>
          <div className="self-stretch justify-between items-center inline-flex">
            <div className="text-[#858d9d] text-sm font-normal">Last 7 days</div>
            <div className="text-[#858d9d] text-sm font-normal">Cost</div>
          </div>
        </div>
      </div>

      <div className="w-[99px] h-[0px] rotate-90 border border-[#f0f1f3]"></div>

      {/* Low Stocks */}
      <div className="w-[235px] flex-col justify-start items-start gap-3 inline-flex">
        <div className="text-[#f36960] text-base font-semibold">Low Stocks</div>
        <div className="self-stretch justify-between items-start inline-flex">
          <div className="text-[#5d6679] text-base font-semibold">{data.lowStocks.totalOrdered}</div>
          <div className="text-[#5d6679] text-base font-semibold">{data.lowStocks.notInStock}</div>
        </div>
        <div className="justify-start items-start gap-[95px] inline-flex">
          <div className="text-[#858d9d] text-sm font-normal">Ordered</div>
          <div className="text-[#858d9d] text-sm font-normal">Not in stock</div>
        </div>
      </div>
    </div>
  );
}
