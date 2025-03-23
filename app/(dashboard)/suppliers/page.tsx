"use client"
import AppInput from '@/components/inputs/input';
import AppTable from '@/components/misc/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { File, Filter, LucideFolderSymlink, Pencil, Search } from 'lucide-react';
import React, { useState } from 'react'

const Page = () => {
  const [search, setsearch] = useState("")
  const [activeIndex, setactiveIndex] = useState<"all" | "top_selling" | "low_stock">("all")
  const [loading, setloading] = useState(false)
  return (
    <div className="p-5 w-full h-full flex flex-col gap-5">
      <div className=" w-full overflow-hidden justify-center">
        <div className=" p-2 bg-white flex-col justify-start items-start gap-5  rounded-t-lg  border-b-0  border-gray-200 mx-auto flex">
          <div className="self-stretch px-6 py-3 justify-start items-center gap-4 inline-flex">
            <div className="grow shrink basis-0 self-stretch flex-col justify-center items-start gap-0 inline-flex">
              <div className="self-stretch justify-start items-center gap-2 inline-flex">
                <span className="text-lg-semibold">Suppliers</span>
                <div className="px-2 py-0.5 bg-sky-50 rounded-full border border-sky-200 justify-start items-center flex">
                  <span className="text-center text-blue-700 text-xs leading-none">
                    data.length
                  </span>
                </div>
              </div>
              <span className="self-stretch text-slate-600 text-sm w-[600px] truncate">
                Gérez les membres ayant accès à votre
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AppInput
                placeholder="Rechercher un produit"
                defaultValue={search}
                onChange={(e) => {
                  setsearch(e.target.value);
                }}
                inputContainerClassName="size-9 w-full"
                inputClassName='!text-xs'
                variant="primary"
                prefixContent={
                  <Search
                    fill="transparent"
                    stroke="currentColor"
                    width={18}
                    height={18}
                  />
                }
              />
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="!shadow-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"

                  >
                    <Filter
                      fill="transparent"
                      stroke="gray"
                      width={20}
                      height={20}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <div className="flex flex-col gap-3 p-4">
                    <div className="flex gap-3 items-center">
                      <Checkbox
                        checked={activeIndex === "all"}
                        onChange={() => {
                          // table.toggleAllPageRowsSelected(false);
                          setactiveIndex("all");
                        }}
                      />
                      <span className="text-sm-regular">
                        Tous les produits
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Checkbox
                        checked={activeIndex === "top_selling"}
                        onChange={() => {
                          // table.toggleAllPageRowsSelected(false);
                          setactiveIndex("top_selling");
                        }}
                      />
                      <span className="text-sm-regular">
                        Top ventes
                      </span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Checkbox
                        checked={activeIndex === "low_stock"}
                        onChange={() => {
                          // table.toggleAllPageRowsSelected(false);
                          setactiveIndex("low_stock");
                        }}
                      />
                      <span className="text-sm-regular">
                        Produits en rupture de stock
                      </span>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className="!shadow-none">
                  <Button
                    variant="default"
                  >
                    <Pencil
                      stroke="white"
                      fill="transparent"
                      width={20}
                      height={20}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>

                  <DropdownMenuItem
                    className='!gap-3'
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();

                    }}
                  >
                    <File
                      stroke="var(--gray-500)"
                      strokeWidth={2}
                      fill="transparent"
                      width={16}
                      height={16}
                    />
                    Créer un produit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='!gap-3'
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();

                    }}
                  >
                    <LucideFolderSymlink
                      stroke="var(--gray-500)"
                      fill="transparent"
                      width={20}
                      height={20}
                    />
                    Créer une catégorie
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>
        </div>
        <AppTable
          header={
            <React.Fragment>
              <TableHead className="">Products</TableHead>
              <TableHead className="">Buying Price</TableHead>
              <TableHead className="">Quantity</TableHead>
              <TableHead className="">Threshold Value</TableHead>
              <TableHead className="">Expiry Date</TableHead>
              <TableHead className="">Availability</TableHead>
            </React.Fragment>
          }
          body={
            <React.Fragment>
              {Array.from({ length: 50 }).map((item, index) => (
                <TableRow
                  key={index}
                  onClick={() => {
                    //setopenModal({ open: true, data: item });
                  }}
                  className="hover:bg-gray-50 text-sm"
                >
                  <TableCell className="">Maggi</TableCell>
                  <TableCell className="">₹430</TableCell>
                  <TableCell className="">43 Packets</TableCell>
                  <TableCell className="">
                    12 Packets
                  </TableCell>
                  <TableCell className="">11/12/22</TableCell>
                  <TableCell className=" text-success">In stock</TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          }
          loading={loading}
          maxHeightClassName="max-h-[calc(100vh-355px)]"
          columnWidths={[.2, .2, .2, .2, .2, .2]}
          tableWidth={1000}
        />
      </div>
    </div>
  )
}

export default Page;