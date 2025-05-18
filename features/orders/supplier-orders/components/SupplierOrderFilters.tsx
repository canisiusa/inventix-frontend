import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Search, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { GetSupplierOrderParams } from '@/lib/api/supplierOrdersApi';
import { cn } from '@/lib/utils';
import { ComboboxAsync } from '@/components/inputs/ComboboxAsync';
import { getSuppliers } from '@/lib/api/supplierApi';
import { getProducts } from '@/lib/api/productsApi';

const filterFormSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED', 'RETURNED']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  supplierId: z.string().optional(),
  productId: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterFormSchema>;

interface SupplierOrderFiltersProps {
  initialFilters?: GetSupplierOrderParams;
  onApplyFilters: (filters: GetSupplierOrderParams) => void;
}

const SupplierOrderFilters: React.FC<SupplierOrderFiltersProps> = ({ initialFilters, onApplyFilters }) => {

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      search: initialFilters?.search || '',
      status: initialFilters?.status,
      startDate: initialFilters?.startDate ? new Date(initialFilters.startDate) : undefined,
      endDate: initialFilters?.endDate ? new Date(initialFilters.endDate) : undefined,
      supplierId: initialFilters?.supplierId || '',
      productId: initialFilters?.productId || '',
    },
  });

  const onSubmit = (values: FilterFormValues) => {
    const filters: GetSupplierOrderParams = {
      search: values.search || undefined,
      status: values.status,
      startDate: values.startDate ? format(values.startDate, 'yyyy-MM-dd') : undefined,
      endDate: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : undefined,
      supplierId: values.supplierId || undefined,
      productId: values.productId || undefined,
    };

    onApplyFilters(filters);
  };

  const resetFilters = () => {
    form.reset({
      search: '',
      status: undefined,
      startDate: undefined,
      endDate: undefined,
      supplierId: '',
      productId: '',
    });

    onApplyFilters({});
  };

  const hasActiveFilters = () => {
    const values = form.getValues();
    return !!(
      values.search ||
      values.status ||
      values.startDate ||
      values.endDate ||
      values.supplierId ||
      values.productId
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded-md shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Recherche</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher..." {...field} className="pl-8" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Statut</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={"PENDING"}>En attente</SelectItem>
                    <SelectItem value={"CONFIRMED"}>Confirmée</SelectItem>
                    <SelectItem value={"CANCELLED"}>Annulée</SelectItem>
                    <SelectItem value={"DELIVERED"}>Livrée</SelectItem>
                    <SelectItem value={"RETURNED"}>Retournée</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de début</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date de fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Choisir une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <ComboboxAsync
            name="supplierId"
            control={form.control}
            label="Fournisseur"
            placeholder="Sélectionner un fournisseur"
            fetcher={({ search, page, limit }) =>
              getSuppliers({ search, page, limit }).then((res) => res.data)
            }
            //initialValue={props.product?.supplier ?? undefined}
            getId={(supplier) => supplier.id}
            getLabel={(supplier) => supplier?.name}
          />

          <ComboboxAsync
            name="productId"
            control={form.control}
            label="Produit"
            placeholder="Sélectionner un produit"
            fetcher={({ search, page, limit }) =>
              getProducts({ search, page, limit }).then((res) => res.data)
            }
            //initialValue={props.product?.supplier ?? undefined}
            getId={(product) => product.id}
            getLabel={(product) => product?.name}
          />

        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={!hasActiveFilters()}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Réinitialiser
          </Button>
          <Button type="submit">Appliquer les filtres</Button>
        </div>
      </form>
    </Form>
  );
};

export default SupplierOrderFilters;
