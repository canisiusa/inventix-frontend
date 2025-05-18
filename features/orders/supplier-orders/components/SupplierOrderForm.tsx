import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  SupplierOrderProduct,
  CreateSupplierOrderParams,
  UpdateSupplierOrderParams
} from '@/lib/api/supplierOrdersApi';
import { useRouter } from 'next/navigation';
import { ComboboxAsync } from '@/components/inputs/ComboboxAsync';
import { getSuppliers } from '@/lib/api/supplierApi';
import ProductForm from './ProductForm';
import { PurchaseOrderBuilderProps, showPurchaseOrderBuilder } from './PurchaseOrderBuilder';

const supplierOrderProductSchema = z.object({
  productId: z.string().uuid({ message: "ID de produit invalide" }),
  quantity: z.number().min(1, { message: "La quantité doit être au moins 1" }),
  productName: z.string().optional(),
  sku: z.string().optional(),
  unitPrice: z.number().optional().nullable(),
});

const supplierOrderSchema = z.object({
  supplierId: z.string({ message: "Champs requis" }).uuid({ message: "Veuillez sélectionner un fournisseur valide" }),
  products: z.array(supplierOrderProductSchema).min(1, { message: "Au moins un produit est requis" }),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED', 'RETURNED'], {
    message: "Veuillez sélectionner un statut valide"
  }),
});

type SupplierOrderFormValues = z.infer<typeof supplierOrderSchema>;

interface SupplierOrderFormProps {
  isEditing: boolean;
  initialData?: SupplierOrder;
  isSubmitting: boolean;
  onSubmit: (
    data: CreateSupplierOrderParams | UpdateSupplierOrderParams
  ) => void;
  companyId?: string;
}

const SupplierOrderForm: React.FC<SupplierOrderFormProps> = ({
  isEditing,
  initialData,
  isSubmitting,
  onSubmit,
}) => {
  const router = useRouter();

  // Initialize form with either initial data or defaults
  const form = useForm<SupplierOrderFormValues>({
    resolver: zodResolver(supplierOrderSchema),
    defaultValues: {
      supplierId: initialData?.supplierId || "",
      products: initialData?.products
        ? initialData.products.map(p => ({
          productId: p.productId,
          productName: p.product.name,
          unitPrice: p.unitPrice,
          sku: p.product.sku,
          quantity: p.quantity
        }) as SupplierOrderProduct)
        : [{ productId: "", quantity: 1 } as SupplierOrderProduct],
      status: initialData?.status || "PENDING",
    },
  });

  const [selectedSupplier, setselectedSupplier] = useState(initialData?.supplier)


  const handleSubmit = async (values: SupplierOrderFormValues) => {
    // Format data to match API expectations
    if (isEditing && initialData) {
      const updateData: UpdateSupplierOrderParams = {
        supplierId: values.supplierId,
        products: values.products as SupplierOrderProduct[],
        status: values.status,
      };
      if (values.status === "CONFIRMED" && !initialData.pdfUrl) {
        await showPurchaseOrderBuilder({
          isOpen: true,
          orderId: initialData.id,
          supplier: selectedSupplier,
          lignesProduit: values.products.map((product) => ({
            nomProduit: product.productName,
            unitPrice: product.unitPrice,
            productId: product.productId,
            sku: product.sku,
            quantite: product.quantity,
          })),
        } as PurchaseOrderBuilderProps);
        return;
      }
      onSubmit(updateData);
    } else {
      const createData: CreateSupplierOrderParams = {
        supplierId: values.supplierId,
        products: values.products as SupplierOrderProduct[],
        status: values.status,
      };
      onSubmit(createData);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <ComboboxAsync
                  name="supplierId"
                  control={form.control}
                  label="Fournisseur"
                  placeholder="Sélectionner un fournisseur"
                  onChange={(supplier) => {
                    setselectedSupplier(supplier);
                  }}
                  fetcher={({ search, page, limit }) =>
                    getSuppliers({ search, page, limit }).then((res) => res.data)
                  }
                  initialValue={initialData?.supplier ?? undefined}
                  getId={(supplier) => supplier.id}
                  getLabel={(supplier) => supplier?.name}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un statut" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ProductForm
                  name="products"
                  disabled={initialData && initialData.status !== "PENDING"}
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/orders/supplier-orders")}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default SupplierOrderForm;
