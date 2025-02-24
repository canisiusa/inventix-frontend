import { z } from "zod";

export const LoginSchema = z.object({
    email: z
    .string()
    .email({ message: "Adresse email non valide" }),
    rememberMe: z.boolean().default(false),
    password: z.string(),
});
export type LoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    businessname: z.string({message: "Business name is required"}),
    name: z.string({message: "User fullname is required"}),
    email: z
        .string({message: "Email is required"})
        .email({ message: "Invalid Email adress" }),
    password: z.string({message: "Password is required"}).min(8, {message: "Password must be larger than 8 caracters",}),
});
export type RegisterSchema = z.infer<typeof RegisterSchema>;
