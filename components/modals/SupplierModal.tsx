import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupplierFormValues, supplierSchema } from "@/lib/schemas/supplier.schemas";
import { useToast } from "@/hooks/use-toast";
import { ContainerProps, create } from "react-modal-promise";
import { createSupplier, updateSupplier } from "@/lib/api/supplierApi";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";

export interface SupplierModalProps extends ContainerProps {
  isOpen: boolean;
  supplier?: Supplier;
}

function SupplierModal(props: SupplierModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!props.supplier;
  const { t } = useLocalization()
  const { toast } = useToast();

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: props.supplier?.name || "",
      email: props.supplier?.email || "",
      phone: props.supplier?.phone || "",
      address: props.supplier?.address || ""
    },
  });

  const handleSubmit = async (data: SupplierFormValues) => {
    try {
      setIsSubmitting(true);
      if (isEditing) {
        await updateSupplier(props.supplier?.id || "", data);
      } else {
        await createSupplier(data);
      }
      toast({
        title: isEditing ? "Fournisseur mis à jour" : "Fournisseur ajouté",
        description: isEditing
          ? `${data.name} a été mis à jour avec succès`
          : `${data.name} a été ajouté avec succès`,
      });
      props.onResolve?.("success");
    } catch (error) {
      handleError({
        error,
        message: isEditing
          ? "Erreur lors de la mise à jour du fournisseur"
          : "Erreur lors de l'ajout du fournisseur",
        dict: t
      });
      props.onReject?.("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={() => { props.onReject?.("cancel") }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le fournisseur" : "Ajouter un fournisseur"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom et Prénoms*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du fournisseur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email du fournisseur"
                      type="email"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Numéro de téléphone"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adresse du fournisseur"
                      className="resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => props.onReject?.("cancel")}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : isEditing ? "Mettre à jour" : "Ajouter"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export const showSupplierModal = create(SupplierModal)