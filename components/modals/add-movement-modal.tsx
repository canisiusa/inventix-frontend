/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stockMovementSchema, AddStockMovementDto } from "@/lib/schemas/warehouse.schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContainerProps, create } from "react-modal-promise";
import { ComboboxAsync } from "@/components/inputs/ComboboxAsync";
import { getProducts } from "@/lib/api/productsApi";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { addStockMovement } from "@/lib/api/warehouseApi";
import { useEffect, useState } from "react";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";

export interface AddStockMovementModalProps extends ContainerProps {
  isOpen: boolean;
  onResolve?: (data: any) => void;
  warehouseId?: string;
  stock?: Stock;
  type?: "IN" | "OUT" | "ADJUSTMENT";
}

function AddMovementModal(props: AddStockMovementModalProps) {
  const { toast } = useToast();
  const { t } = useLocalization();

  const form = useForm<AddStockMovementDto>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues: {
      stockId: props.stock?.id ?? "",
      quantity: 1,
      type: props.type ?? "IN",
      notes: "",
    },
  });
  const { handleSubmit, control, reset } = form;


  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    if (type === "ADJUSTMENT") {
      form.setValue("quantity", stock?.quantity ?? 1);
    } else {
      form.setValue("quantity", 1);
    }
  }, [type, props.stock?.quantity, form]);


  const [stock, setstock] = useState(props.stock)

  const onSubmit = async (data: AddStockMovementDto) => {
    try {
      const resp = await addStockMovement(data);
      const typeText =
        data.type === "IN"
          ? "entrée"
          : data.type === "OUT"
            ? "sortie"
            : "ajustement";

      toast({
        title: "Mouvement de stock ajouté",
        description: `${typeText.charAt(0).toUpperCase() + typeText.slice(1)} de ${data.quantity} enregistrée avec succès.`,
      });

      reset();
      props.onResolve?.(resp.data);

    } catch (error) {
      console.error(error);
      handleError({ error, message: "Erreur lors de l'ajout du mouvement de stock.", dict: t });
    }
  };

  return (
    <Dialog open={props.isOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Ajouter un mouvement de stock</DialogTitle>
              <DialogDescription>
                <p>
                  Enregistrez une entrée, une sortie ou un ajustement de stock
                  {stock?.warehouse && (
                    <>
                      {' pour l’entrepôt '}
                      <span className="font-medium text-black font-mono">{stock.warehouse.name}</span>
                    </>
                  )}
                  .
                </p>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <ComboboxAsync
                control={form.control}
                name="stockId"
                label="Produit"
                placeholder="Sélectionner un produit"
                onChange={(value) => {
                  setstock(value?.stock)
                }}
                fetcher={({ search, page, limit }) =>
                  getProducts({
                    search, page, limit,
                    ...(props.warehouseId ? { warehouseId: props.warehouseId } : {})
                  }).then((res) => res.data).catch(() => {
                    toast({
                      title: "Erreur",
                      description: "Erreur lors de la récupération des produits.",
                      variant: "destructive",
                    });
                    return [];
                  })
                }
                getId={(product) => product.stock?.id}
                getLabel={(product) => product?.name}
                initialValue={props.stock?.product}
              />

              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de mouvement</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN">Entrée</SelectItem>
                          <SelectItem value="OUT">Sortie</SelectItem>
                          <SelectItem value="ADJUSTMENT">Ajustement</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité</FormLabel>
                    <FormDescription>
                      Indiquez la quantité à ajouter ou à retirer. S'il s'agit d'un ajustement, indiquez la nouvelle quantité du stock.
                    </FormDescription>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = Math.max(1, field.value - 1);
                            field.onChange(newValue);
                          }}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          className="text-center flex-1"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            field.onChange(field.value + 1);
                          }}
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informations complémentaires sur ce mouvement..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => props.onReject?.("cancel")}
              >
                Annuler
              </Button>
              <Button type="submit">Valider le mouvement</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const showAddStockMovementModal = create(AddMovementModal);
