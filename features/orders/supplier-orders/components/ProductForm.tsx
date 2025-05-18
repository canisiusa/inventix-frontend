/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { X, Plus } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SupplierOrderProduct } from '@/lib/api/supplierOrdersApi';
import { ComboboxAsync } from '@/components/inputs/ComboboxAsync';
import { getProducts } from '@/lib/api/productsApi';

interface ProductFormProps {
  name: string;
  disabled?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ name, disabled }) => {
  const { control, formState, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Produits</h3>
        <Button
          type="button"
          disabled={disabled}
          onClick={() => append({ productId: '', quantity: 1 } as SupplierOrderProduct)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-4 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">
            Aucun produit ajouté. Cliquez sur &quot;Ajouter un produit&quot; pour commencer.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Produit</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">Quantité</th>
                <th className="py-3 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-t">
                  <td className="py-3 px-4">
                    <ComboboxAsync
                      name={`${name}.${index}.productId`}
                      control={control}
                      disabled={disabled}
                      placeholder="Sélectionner un produit"
                      onChange={(value:any) => {
                        setValue(`${name}.${index}.productName`, value?.name ?? '');
                        setValue(`${name}.${index}.sku`, value?.sku ?? '');
                      }}
                      fetcher={({ search, page, limit }) =>
                        getProducts({ search, page, limit }).then((res) => res.data)
                      }
                      getId={(produit) => produit.id}
                      getLabel={(produit) => produit?.name}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <FormField
                      control={control}
                      name={`${name}.${index}.quantity`}
                      render={({ field: quantityField }) => (
                        <FormItem className="space-y-0">
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              disabled={disabled}
                              {...quantityField}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                quantityField.onChange(isNaN(value) ? 1 : value);
                              }}
                              className="w-24"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="h-8 w-8 p-0"
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Supprimer le produit</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formState.errors[name] && (
        <p className="text-sm text-destructive mt-1">
          {formState.errors[name]?.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default ProductForm;
