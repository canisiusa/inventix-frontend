/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { motion } from "framer-motion"
import {
  Button
} from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover"
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card"
import {
  ToggleGroup, ToggleGroupItem
} from "@/components/ui/toggle-group"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import {
  ListIcon, BarChart2Icon, SlashIcon, CalendarIcon
} from "lucide-react"
import { create, ContainerProps } from "react-modal-promise"

export interface ProductFilterModalProps extends ContainerProps {
  isOpen: boolean
  onResolve: (data: any) => void
  onReject: () => void
  type?: "all" | "topSelling" | "outOfStock"
  threshold?: string
  startDate?: Date
  endDate?: Date
}

export const ProductFilterModal: React.FC<ProductFilterModalProps> = ({
  isOpen, onResolve, onReject, type, threshold, startDate: initStart, endDate: initEnd
}) => {
  const [filterType, setFilterType] = useState(type || "all")
  const [minSales, setMinSales] = useState(threshold ?? "1000")
  const [startDate, setStartDate] = useState<Date | undefined>(initStart)
  const [endDate, setEndDate] = useState<Date | undefined>(initEnd)

  // Validation simple : si topSelling, on exige un seuil et un intervalle
  const isValid = useMemo(() => {
    if (filterType !== "topSelling") return true
    return !!minSales && !!startDate && !!endDate
  }, [filterType, minSales, startDate, endDate])

  const resetForm = () => {
    setFilterType("all")
    setMinSales("1000")
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const handleApply = () => {
    onResolve({
      type: filterType,
      minSales: filterType === "topSelling" ? parseInt(minSales, 10) : undefined,
      dateRange: filterType === "topSelling" ? { startDate, endDate } : undefined
    })
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-lg">
        <TooltipProvider>
          <DialogHeader>
            <DialogTitle>Filtrer les produits</DialogTitle>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 py-2"
          >
            {/* 1. Choix du type de filtre */}
            <Card>
              <CardHeader>
                <CardTitle>Type de filtre</CardTitle>
              </CardHeader>
              <CardContent>
                <ToggleGroup
                  type="single"
                  value={filterType}
                  onValueChange={(val) => setFilterType(val as any)}
                  className="flex space-x-2"
                >
                  <ToggleGroupItem value="all" className="flex-1">
                    <Tooltip>
                      <TooltipTrigger className="flex-1 w-full flex items-center justify-center gap-1">
                        <ListIcon className="h-5 w-5" />
                        Tous
                      </TooltipTrigger>
                      <TooltipContent>Afficher tous les produits</TooltipContent>
                    </Tooltip>
                  </ToggleGroupItem>

                  <ToggleGroupItem value="topSelling" className="flex-1">
                    <Tooltip>
                      <TooltipTrigger className="flex-1 flex items-center justify-center gap-1">
                        <BarChart2Icon className="h-5 w-5" />
                        Top ventes
                      </TooltipTrigger>
                      <TooltipContent>Produits les plus vendus</TooltipContent>
                    </Tooltip>
                  </ToggleGroupItem>

                  <ToggleGroupItem value="outOfStock" className="flex-1">
                    <Tooltip>
                      <TooltipTrigger className="flex-1 flex items-center justify-center gap-1">
                        <SlashIcon className="h-5 w-5" />
                        Rupture
                      </TooltipTrigger>
                      <TooltipContent>Produits en rupture de stock</TooltipContent>
                    </Tooltip>
                  </ToggleGroupItem>
                </ToggleGroup>
              </CardContent>
            </Card>

            {/* 2. Options avancées (Top ventes) */}
            {filterType === "topSelling" && (
              <Card>
                <CardHeader>
                  <CardTitle>Détails Top Ventes</CardTitle>
                  <Button size="sm" variant="ghost" onClick={resetForm}>
                    Réinitialiser
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="minSales">Seuil min. de ventes</Label>
                    <Input
                      id="minSales"
                      type="number"
                      placeholder="Ex. 1000"
                      value={minSales}
                      onChange={(e) => setMinSales(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {["startDate", "endDate"].map((field) => (
                      <div key={field} className="grid gap-2">
                        <Label htmlFor={field}>{field === "startDate" ? "De" : "À"}</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id={field}
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field === "startDate"
                                ? (startDate ? format(startDate, "dd/MM/yyyy") : "Sélectionner")
                                : (endDate ? format(endDate, "dd/MM/yyyy") : "Sélectionner")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Calendar
                              mode="single"
                              selected={field === "startDate" ? startDate : endDate}
                              onSelect={field === "startDate" ? setStartDate : setEndDate}
                              initialFocus
                              locale={fr}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onReject()}>
              Annuler
            </Button>
            <Button disabled={!isValid} onClick={handleApply}>
              Appliquer
            </Button>
          </div>
        </TooltipProvider>
      </DialogContent>
    </Dialog>
  )
}

export const showProductFilterModal = create(ProductFilterModal)






/* "use client"

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
  isOpen: boolean;
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
    <Dialog open={props.isOpen}>
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


 */