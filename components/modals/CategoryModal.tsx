import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/category.store";
import { useToast } from "@/hooks/use-toast";
import { AddCategoryInputs, addCategorySchema } from "@/lib/schemas/category.schemas";
import { ContainerProps, create } from "react-modal-promise";
import { createCategory } from "@/lib/api/categoryApi";
import { handleError } from "@/lib/utils";
import { useLocalization } from "@/providers/localization-provider";
import { useState } from "react";

interface AddCategoryModalProps extends ContainerProps {
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResolve: (value?: any) => void;
  onReject: (reason: string) => void;
}

const AddCategoryModal = (props: AddCategoryModalProps) => {
  const { addCategory } = useCategoryStore();
  const { toast } = useToast();

  const [loading, setloading] = useState(false)

  const form = useForm<AddCategoryInputs>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
      color: "#3B82F6",
    },
  });

  const { t } = useLocalization();

  const onSubmit = async (data: AddCategoryInputs) => {
    try {
      setloading(true)
      const result = await createCategory(data);
      addCategory(result);
      props.onResolve?.("");
      form.reset();

      toast({
        title: "Catégorie ajoutée",
        description: `La catégorie ${data.name} a été ajoutée avec succès.`,
      });
    } catch (error) {
      handleError({ error, message: "Une erreur est survenue lors de l'ajout de la catégorie.", dict: t })
    } finally { 
      setloading(false)
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={() => props.onReject?.("cancel")}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une catégorie</DialogTitle>
          <DialogDescription>
            Créez une nouvelle catégorie en remplissant les champs ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la catégorie</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Électronique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" placeholder="#RRGGBB" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button loading={loading} type="submit">Ajouter la catégorie</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const showAddCategoryModal = create(AddCategoryModal);
