/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AddProductSchema } from '@/lib/schemas/inventory.schemas';
import { toast } from 'sonner';
import { create, ContainerProps } from "react-modal-promise";
import { useCategoryStore } from '@/store/category.store';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, handleError } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from "date-fns";
import { createProduct, updateProduct } from '@/lib/api/productsApi';
import { useLocalization } from '@/providers/localization-provider';
import { getSuppliers } from '@/lib/api/supplierApi';
import { ComboboxAsync } from '@/components/inputs/ComboboxAsync';
import { getWarehouses } from '@/lib/api/warehouseApi';
import { useEffect, useState } from 'react';
import { GenericCombobox } from '@/components/inputs/GenericCombobox';
import { useUserStore } from '@/store/user.store';


const units = [
  { value: 'bidon', label: 'Bidon' },
  { value: 'boîte', label: 'Boîte' },
  { value: 'bouteille', label: 'Bouteille' },
  { value: 'carton', label: 'Carton' },
  { value: 'centimètre', label: 'Centimètre (cm)' },
  { value: 'colis', label: 'Colis' },
  { value: 'g', label: 'Gramme (g)' },
  { value: 'kg', label: 'Kilogramme (kg)' },
  { value: 'l', label: 'Litre (l)' },
  { value: 'mètre', label: 'Mètre (m)' },
  { value: 'ml', label: 'Millilitre (ml)' },
  { value: 'palette', label: 'Palette' },
  { value: 'pallet', label: 'Pallet' },
  { value: 'pallets', label: 'Pallets' },
  { value: 'pallettes', label: 'Pallettes' },
  { value: 'pièce', label: 'Pièce' },
  { value: 'sachet', label: 'Sachet' },
  { value: 'unité', label: 'Unité' },
];


export interface ProductFormProps extends ContainerProps {
  isOpen: boolean;
  onResolve?: (data: any) => void;
  onReject?: () => void;
  product?: Product;
  warehouse?: Warehouse;
}

const ProductForm: React.FC<ProductFormProps> = (props: ProductFormProps) => {
  const categories = useCategoryStore((state) => state.categories);
  const [loading, setloading] = useState(false)
  const { t } = useLocalization();
  const currentUser = useUserStore((state) => state.currentUser);

  const form = useForm<AddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: props.product ? {
      name: props.product.name,
      categoryId: props.product.categoryId,
      warehouseId: props.product.stock?.warehouseId,
      unit: props.product.unit,
      currentStock: props.product.stock?.quantity || 0,
      minimumStock: props.product.stock?.minimumStock || 0,
      price: props.product.price,
      expiryDate: props.product.expiryDate || undefined,
      supplierId: props.product.supplierId || undefined,
      description: '',
      sku: props.product.sku,
    } : {
      name: '',
      categoryId: '',
      unit: 'kg',
      currentStock: 0,
      minimumStock: 0,
      price: 0,
      supplierId: '',
      description: '',
      warehouseId: props.warehouse?.id,
      sku: generateSKU(""),
    },
  });


  useEffect(() => {
    const subscription = form.watch((values, { name: changedField }) => {
      if (changedField === 'name') {
        const newSku = generateSKU(values.name ?? "");
        form.setValue('sku', newSku, { shouldDirty: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  function generateSKU(name: string): string {
    if (props.product) return props.product.sku;

    const getPart = (str: string | undefined, len: number, fallback = 'X') =>
      (str ?? '').toUpperCase().substring(0, len).padEnd(len, fallback);

    const now = new Date();
    const yearHex = now.getFullYear().toString(16).toUpperCase();
    const month = (now.getMonth() + 1).toString();

    const datePart = `${yearHex}${month}`;

    const randomPart = Math.floor(10 + Math.random() * 90).toString(); // 2 chiffres de 10 à 99
    const productPart = getPart(name, 3);

    return `${datePart}-${productPart}${randomPart}`;
  }



  const handleAddProduct = async (data: AddProductSchema) => {
    try {
      setloading(true);
      const newProduct: AddProductSchema = {
        name: data.name,
        categoryId: data.categoryId,
        unit: data.unit,
        currentStock: data.currentStock,
        minimumStock: data.minimumStock,
        price: data.price,
        expiryDate: data.expiryDate || undefined,
        supplierId: data.supplierId || undefined,
        sku: data.sku,
        description: data.description,
        warehouseId: data.warehouseId,
      };
      const resp = await createProduct(newProduct);

      props.onResolve?.(resp)

      toast.success("Produit ajouté", {
        description: `${newProduct.name} a été ajouté à l'inventaire.`
      });
    } catch (error) {
      handleError({ error, message: "Erreur lors de l'ajout du produit.", dict: t });
    } finally {
      setloading(false);
    }
  };

  const handleUpdateProduct = async (data: AddProductSchema) => {
    try {
      const resp = await updateProduct(props.product!.id, data);
      props.onResolve?.(resp)
      toast.success("Produit mis à jour", {
        description: `${data.name} a été mis à jour.`
      });
    } catch (error) {
      handleError({ error, message: "Erreur lors de la mise à jour du produit.", dict: t });
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog
      open={props.isOpen}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{props.product ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
          <DialogDescription>
            {props.product
              ? 'Modifier les informations du produit ci-dessous.'
              : 'Saisissez les informations du nouveau produit ci-dessous.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              if (props.product) {
                handleUpdateProduct(data);
              } else {
                handleAddProduct(data);
              }
            })}
            className="space-y-6 max-h-[600px] overflow-y-auto"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du produit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GenericCombobox
                control={form.control}
                name="categoryId"
                options={categories}
                labelKey="name"
                valueKey="id"
                label="Catégorie"
              />

              <GenericCombobox
                control={form.control}
                name="unit"
                options={units}
                labelKey="label"
                valueKey="value"
                placeholder='Sélectionner une unité'
                label="Unité"
              />

              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock actuel</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} disabled={props.product ? true : false} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minimumStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seuil stock considéré comme critique</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix unitaire ({currentUser?.company.currency})</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identifiant unique(sku)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} disabled={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'expiration (optionnel)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "dd/MM/yyyy") : "Sélectionner une date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => field.onChange(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
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
                initialValue={props.product?.supplier ?? undefined}
                getId={(supplier) => supplier.id}
                getLabel={(supplier) => supplier?.name}
              />

              <ComboboxAsync
                name="warehouseId"
                control={form.control}
                label="Entrepôt"
                placeholder="Sélectionner un entrepôt"
                fetcher={({ search, page, limit }) =>
                  getWarehouses({ search, page, limit }).then((res) => res.data.data)
                }
                initialValue={props.product?.stock?.warehouse ?? props.warehouse ?? undefined}
                getId={(supplier) => supplier.id}
                getLabel={(supplier) => supplier?.name}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations supplémentaires sur le produit"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={props.onReject} type="button">
                Annuler
              </Button>
              <Button type="submit" loading={loading}>
                {props.product ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  );
};
export default ProductForm;

export const showProductFormModal = create(ProductForm);