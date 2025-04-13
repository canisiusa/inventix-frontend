import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Format d'email invalide" }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal(""))
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;