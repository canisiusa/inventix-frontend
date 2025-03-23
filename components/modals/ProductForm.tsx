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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddProductSchema } from '@/lib/schemas/inventory.schemas';
import { toast } from 'sonner';
import { create, ContainerProps } from "react-modal-promise";

const categories: Category[] = [
  { id: 'c1', name: 'Viandes', color: '#EF4444' },
  { id: 'c2', name: 'Poissons', color: '#3B82F6' },
  { id: 'c3', name: 'Fruits', color: '#F59E0B' },
  { id: 'c4', name: 'Légumes', color: '#22C55E' },
  { id: 'c5', name: 'Produits laitiers', color: '#8B5CF6' },
  { id: 'c6', name: 'Épicerie', color: '#EC4899' },
  { id: 'c7', name: 'Boissons', color: '#06B6D4' },
];

const suppliers = [
  {
    id: 's1',
    name: 'Boucherie Centrale',
    contactPerson: 'Marc Durand',
    email: 'contact@boucherie-centrale.fr',
    phone: '01 23 45 67 89',
    address: '15 Rue des Bouchers, 75001 Paris',
    products: ['p1', 'p5'],
    category: 'Viandes',
    contactPhone: '01 23 45 67 89',
    contactEmail: 'contact@boucherie-centrale.fr',
    deliveryTime: '2-3',
    lastOrderDate: '25/09/2023',
  },
  {
    id: 's2',
    name: 'Poissonnerie de la Mer',
    contactPerson: 'Lucie Mer',
    email: 'commandes@poissonnerie-mer.fr',
    phone: '01 98 76 54 32',
    address: '42 Avenue du Port, 13001 Marseille',
    products: ['p2', 'p6'],
    category: 'Poissons',
    contactPhone: '01 98 76 54 32',
    contactEmail: 'commandes@poissonnerie-mer.fr',
    deliveryTime: '1-2',
    lastOrderDate: '28/09/2023',
  },
  {
    id: 's3',
    name: 'Primeurs Bio',
    contactPerson: 'Thomas Legrand',
    email: 'contact@primeursbio.fr',
    phone: '01 45 67 89 10',
    address: '3 Rue du Marché, 69001 Lyon',
    products: ['p3', 'p4', 'p7', 'p8'],
    category: 'Fruits et Légumes',
    contactPhone: '01 45 67 89 10',
    contactEmail: 'contact@primeursbio.fr',
    deliveryTime: '1',
    lastOrderDate: '01/10/2023',
  },
  {
    id: 's4',
    name: 'Épicerie Fine',
    contactPerson: 'Emma Petit',
    email: 'commandes@epicerie-fine.fr',
    phone: '01 56 78 90 12',
    address: '27 Rue Gourmande, 75007 Paris',
    products: ['p9', 'p10'],
    category: 'Épicerie',
    contactPhone: '01 56 78 90 12',
    contactEmail: 'commandes@epicerie-fine.fr',
    deliveryTime: '3-5',
    lastOrderDate: '20/09/2023',
  },
];


export interface ProductFormProps extends ContainerProps {
  onResolve: (data: any) => void;
  onReject: () => void;
  product?: Product;
}

const ProductForm:React.FC<ProductFormProps> = (props: ProductFormProps) => {
  const form = useForm<AddProductSchema>({
    resolver: zodResolver(AddProductSchema),
    defaultValues: props.product ? {
      name: props.product.name,
      category: props.product.category,
      unit: props.product.unit,
      currentStock: props.product.currentStock,
      minimumStock: props.product.minimumStock,
      price: props.product.price,
      expiryDate: props.product.expiryDate,
      supplierId: props.product.supplierId,
      notes: '',
    } : {
      name: '',
      category: '',
      unit: 'kg',
      currentStock: 0,
      minimumStock: 0,
      price: 0,
      expiryDate: '',
      supplierId: '',
      notes: '',
    },
  });

  const units = [
    { value: 'kg', label: 'Kilogramme (kg)' },
    { value: 'g', label: 'Gramme (g)' },
    { value: 'l', label: 'Litre (l)' },
    { value: 'ml', label: 'Millilitre (ml)' },
    { value: 'pièce', label: 'Pièce' },
    { value: 'carton', label: 'Carton' },
    { value: 'bouteille', label: 'Bouteille' },
    { value: 'unité', label: 'Unité' },
  ];

  // 'mètre', 'centimètre', 'boîte', 'sachet', 'bidon', 'palette', 'colis', 'pallette', 'pallet', 'pallets', 'pallettes,

  const handleAddProduct = (data: AddProductSchema) => {
    // In a real app, this would be an API call
    const newProduct: AddProductSchema = {
      name: data.name,
      category: data.category,
      unit: data.unit,
      currentStock: data.currentStock,
      minimumStock: data.minimumStock,
      price: data.price,
      expiryDate: data.expiryDate || undefined,
      supplierId: data.supplierId,
      sku: data.sku,
      notes: data.notes,
      warehouseId: data.warehouseId,
    };

    props.onResolve(data)

    toast.success("Produit ajouté", {
      description: `${newProduct.name} a été ajouté à l'inventaire.`
    });
  };

  const handleUpdateProduct = (data: AddProductSchema) => {
    props.onResolve(data)
    toast.success("Produit mis à jour", {
      description: `${data.name} a été mis à jour.`
    });
  };

  return (
    <Dialog
      open
      onOpenChange={props.onReject}
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
            className="space-y-6"
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une unité" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock actuel</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
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
                    <FormLabel>Seuil minimum</FormLabel>
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
                    <FormLabel>Prix unitaire (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
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
                    <FormLabel>Date d&apos;expiration (optionnel)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fournisseur</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un fournisseur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
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
              <Button type="submit">
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

export const showProductForm = create(ProductForm);