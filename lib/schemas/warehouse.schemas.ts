export enum StockStatus {
  CRITICAL = "CRITICAL",
  MINIMUM_REACHED = "MINIMUM_REACHED",
  NORMAL = "NORMAL",
  RUPTURE = "RUPTURE",
  EXPIRED = "EXPIRED",
}

export interface QueryWarehousesDto {
  search?: string;
  location?: string;
  page?: number;
  limit?: number;
}

import { z } from "zod";


export const stockMovementSchema = z.object({
  stockId: z.string().min(1, "Veuillez sélectionner un produit"),
  quantity: z
    .number({
      required_error: "Veuillez entrer une quantité",
      invalid_type_error: "La quantité doit être un nombre",
    })
    .positive("La quantité doit être un nombre positif"),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"], {
    required_error: "Veuillez sélectionner un type de mouvement",
  }),
  notes: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === "ADJUSTMENT" && (!data.notes || data.notes.trim() === "")) {
    ctx.addIssue({
      path: ["notes"],
      code: z.ZodIssueCode.custom,
      message: "Veuillez ajouter une note pour un ajustement",
    });
  }
});


export type AddStockMovementDto = z.infer<typeof stockMovementSchema>;

export const warehouseFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'entrepôt est requis"),
  location: z.string().optional(),
});

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;
