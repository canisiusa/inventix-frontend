"use client";

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { getLowStockProducts } from '@/lib/api/productsApi';
import { handleError } from '@/lib/utils';
import { useLocalization } from '@/providers/localization-provider';

const LowQtyStock = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { t } = useLocalization();

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await getLowStockProducts({ limit: 3, page: 1 });
        setProducts(response.data);
      } catch (error) {
        handleError({ error, message: 'Failed to fetch low stock products', dict: t });
      }
    };

    fetchLowStockProducts();
  }, []);

  return (
    <div className="w-full h-96 px-4 py-1.5 bg-white rounded-lg flex-col justify-start items-start gap-8 inline-flex overflow-hidden">
      <div className="flex gap-2 w-full items-center justify-between">
        <div className="text-zinc-700 text-lg font-medium">Low Quantity Stock</div>
        {products.length > 0 ? <Link href="/low-stock" className="text-primary hover:underline text-xs font-medium">
          View All
        </Link> : null}
      </div>

      <div className="flex flex-col gap-4 w-full">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="h-[70px] justify-start items-center gap-[26px] inline-flex">
              <img className="w-[60px] h-[70px] rounded" src={product.imageUrl || "https://placehold.co/60x70"} alt='' />
              <div className="flex-col justify-start items-start gap-1 inline-flex">
                <div className="text-[#383e49] text-base font-semibold">{product.name}</div>
                <div className="text-[#667085] text-sm font-normal">Remaining Quantity: {product.remainingQuantity}</div>
              </div>
              <div className="mix-blend-multiply justify-start items-start flex">
                <div className="pl-1.5 pr-2 py-0.5 bg-[#feeceb] rounded-2xl justify-center items-center gap-1 flex">
                  <div className="text-center text-[#aa3028] text-xs font-medium">Low</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center w-full">No low-stock products found.</p>
        )}
      </div>
    </div>
  );
};

export default LowQtyStock;
