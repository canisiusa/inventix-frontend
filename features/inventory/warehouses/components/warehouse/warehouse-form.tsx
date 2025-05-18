"use client";
/* eslint-disable react/no-unescaped-entities */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { WarehouseFormValues, warehouseFormSchema } from "@/lib/schemas/warehouse.schemas";
import { useLocalization } from "@/providers/localization-provider";
import { ContainerProps } from "postcss";
import { handleError } from "@/lib/utils";
import { createWarehouse, updateWarehouse } from "@/lib/api/warehouseApi";
import { create } from "react-modal-promise";
import { useState } from "react";

export interface WarehouseFormProps extends ContainerProps {
  isOpen: boolean;
  onReject?: (action: "cancel" | "abort") => void;
  onResolve?: (value: Warehouse) => void;
  warehouse?: Warehouse;
}

function WarehouseForm({
  isOpen,
  onReject,
  onResolve,
  warehouse,
}: WarehouseFormProps) {
  const isEditing = !!warehouse;
  const { toast } = useToast();
  const [loading, setloading] = useState(false)
  const { t } = useLocalization();

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: warehouse?.name || "",
      location: warehouse?.location || "",
    },
  });

  const handleSubmit = async (values: WarehouseFormValues) => {
    try {
      setloading(true);
      const resp = isEditing ? await updateWarehouse(warehouse!.id, values) : await createWarehouse(values);
      if (resp.status === "failure") {
        throw resp.data;
      } else {
        onResolve?.(resp.data);
        toast({
          title: isEditing ? "Entrepôt modifié" : "Entrepôt créé",
          description: isEditing
            ? `L'entrepôt "${values.name}" a été modifié avec succès.`
            : `L'entrepôt "${values.name}" a été créé avec succès.`,
        });
      }
    } catch (e) {
      handleError({ dict: t, error: e, message: "Une erreur s'est produite lors de la soumission du formulaire." });
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Modifier l'entrepôt" : "Ajouter un entrepôt"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Modifiez les informations de l'entrepôt ci-dessous."
                  : "Remplissez les informations pour créer un nouvel entrepôt."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">Nom de l'entrepôt</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom de l'entrepôt"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris, France" {...field} />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      La localisation aide à identifier l'emplacement géographique de l'entrepôt.
                    </p>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onReject?.("abort")}
              >
                Annuler
              </Button>
              <Button type="submit" loading={loading}>
                {isEditing ? "Enregistrer les modifications" : "Créer l'entrepôt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const showWarehouseForm = create(WarehouseForm)
