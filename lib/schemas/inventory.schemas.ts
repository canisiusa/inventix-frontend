import { z } from "zod";

export const AddProductSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  categoryId: z.string().min(1, { message: 'Veuillez sélectionner une catégorie' }),
  sku: z.string().min(1, { message: 'Veuillez saisir un sku' }),
  unit: z.string().min(1, { message: 'Veuillez sélectionner une unité' }),
  currentStock: z.coerce.number().min(0, { message: 'Le stock ne peut pas être négatif' }),
  minimumStock: z.coerce.number().min(0, { message: 'Le seuil minimal ne peut pas être négatif' }),
  price: z.coerce.number().min(0, { message: 'Le prix ne peut pas être négatif' }),
  expiryDate: z
  .union([
    z.string().transform((str) => new Date(str)), // accepte une string de date
    z.date() // ou une Date valide
  ])
  .optional(),
  supplierId: z.string().optional(),
  warehouseId: z.string({message: "Champs requis"}).min(1, { message: 'Veuillez sélectionner un entrepôt' }),
  description: z.string().optional(),
  image: z.string().url().optional(),
});

export type AddProductSchema = z.infer<typeof AddProductSchema>;