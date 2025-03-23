/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { create, ContainerProps } from "react-modal-promise"

export interface ProductFilterModalProps extends ContainerProps {
  onResolve: (data: any) => void;
  onReject: () => void;
  type?: "all" | "topSelling" | "outOfStock";
  threshold?: string;
  startDate?: Date;
  endDate?: Date;
}

const ProductFilterModal: React.FC<ProductFilterModalProps> = (props: ProductFilterModalProps) => {
  const [filterType, setFilterType] = useState<"all" | "topSelling" | "outOfStock">(props.type || "all")
  const [minSales, setMinSales] = useState<string>(props.threshold ?? "1000")
  const [startDate, setStartDate] = useState<Date | undefined>(props.startDate)
  const [endDate, setEndDate] = useState<Date | undefined>(props.endDate)

  const handleApplyFilter = () => {
    // Here you would implement the actual filtering logic
    console.log("Filter applied:", {
      type: filterType,
      minSales: filterType === "topSelling" ? Number.parseInt(minSales) : undefined,
      dateRange: filterType === "topSelling" ? { startDate, endDate } : undefined,
    })
    props.onResolve(false)
  }

  return (
    <Dialog open onOpenChange={(open) => !open && props.onReject()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrer les produits</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={filterType} onValueChange={(value) => setFilterType(value as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Tous les produits</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="topSelling" id="topSelling" />
              <Label htmlFor="topSelling">Top ventes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="outOfStock" id="outOfStock" />
              <Label htmlFor="outOfStock">Produits en rupture de stock</Label>
            </div>
          </RadioGroup>

          {filterType === "topSelling" && (
            <div className="grid gap-4 pl-6 pt-2">
              <div className="grid gap-2">
                <Label htmlFor="minSales">Nombre minimum de ventes</Label>
                <Input id="minSales" type="number" value={minSales} onChange={(e) => setMinSales(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Période</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Date de début</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="startDate" variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "dd/MM/yyyy") : "Sélectionner"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus locale={fr} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button id="endDate" variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "dd/MM/yyyy") : "Sélectionner"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus locale={fr} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleApplyFilter}>Appliquer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const showProductFilterModal = create(ProductFilterModal);


