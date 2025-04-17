
import { z } from "zod";

// Schéma de validation Zod pour les catégories
export const categorySchema = z.object({
  name: z.string().nonempty("Le nom est requis"),
  color: z
    .string()
    .nonempty("La couleur est requise")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Format couleur invalide"),
});

// Schéma pour l'ajout d'une catégorie (sans id)
export const addCategorySchema = categorySchema.omit({  });
export type AddCategoryInputs = z.infer<typeof addCategorySchema>;

// Schéma pour l'édition d'une catégorie
export const editCategorySchema = categorySchema.pick({ name: true, color: true });
export type EditCategoryInputs = z.infer<typeof editCategorySchema>;

// Type pour les opérations de filtrage
export type FilterOperator = "equal" | "lessThan" | "greaterThan" | "between";

// Type pour les options de filtrage
export type FilterOptions = {
  search: string;
  productCountFilter: {
    operator: FilterOperator;
    value1: number;
    value2?: number;
  } | null;
};