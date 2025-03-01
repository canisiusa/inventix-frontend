"use client"
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocalization } from "@/providers/localization-provider";
import { sendResetPwd } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import AppInput from "@/components/inputs/input";

// Schéma de validation
const validationSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
      .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une lettre majuscule" })
      .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une lettre minuscule" })
      .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Veuillez confirmer votre mot de passe" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ValidationSchema = z.infer<typeof validationSchema>;

// Définir le type précis attendu par sendResetPwd
interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string | null;
  email: string | null;
}

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const { t } = useLocalization();


  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  // Password strength indicators
  const password = watch("password", "");
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    setToken(tokenParam);
    setEmail(emailParam);

    if (!tokenParam || !emailParam) {
      toast.error("Lien de réinitialisation invalide ou expiré");
      setTimeout(() => router.push("/"), 3000);
    }
  }, [searchParams]);


  const onSubmit = async (formData: ValidationSchema) => {
    try {
      setLoading(true);

      // Assurez-vous que toutes les propriétés sont bien définies
      const payload: ResetPasswordData = {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        token: token,
        email: email
      };

      const result = await sendResetPwd(payload);

      if (result.status === 'success') {
        toast.success("Mot de passe réinitialisé avec succès");
        router.push('/login')
      } else {
        throw result.data;
      }


      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      handleError({ error, message: "Une erreur est survenue lors de la réinitialisation", dict: t });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div
        className="w-full max-w-md relative overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-500"
        style={{
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-90 z-0"></div>

        <div className="relative z-10 p-8">
          <button
            onClick={() => router.push("/")}
            className="absolute top-6 left-6 flex items-center text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            <span className="text-sm">Retour</span>
          </button>

          <div className="flex flex-col items-center mb-8 mt-8">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <Lock className="h-8 w-8 text-gray-700" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Réinitialisation du mot de passe</h1>
            <p className="text-gray-500 mt-2 text-center text-sm">
              Créez un nouveau mot de passe sécurisé pour votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <AppInput
                type="password"
                label="Nouveau mot de passe"
                errorText={errors.password?.message}
                onChange={(e) => setValue("password", e.target.value)}
              />
              <AppInput
                type="password"
                label=" Confirmer le mot de passe"
                onChange={(e) => setValue("confirmPassword", e.target.value)}
                errorText={errors.confirmPassword?.message}
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Exigences du mot de passe:</p>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${hasMinLength ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {hasMinLength ? <Check size={12} /> : <span className="text-xs">8</span>}
                  </div>
                  <span className={hasMinLength ? 'text-gray-700' : 'text-gray-500'}>
                    Au moins 8 caractères
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${hasUpperCase ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {hasUpperCase ? <Check size={12} /> : <span className="text-xs">A</span>}
                  </div>
                  <span className={hasUpperCase ? 'text-gray-700' : 'text-gray-500'}>
                    Une lettre majuscule
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${hasLowerCase ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {hasLowerCase ? <Check size={12} /> : <span className="text-xs">a</span>}
                  </div>
                  <span className={hasLowerCase ? 'text-gray-700' : 'text-gray-500'}>
                    Une lettre minuscule
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${hasNumber ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {hasNumber ? <Check size={12} /> : <span className="text-xs">1</span>}
                  </div>
                  <span className={hasNumber ? 'text-gray-700' : 'text-gray-500'}>
                    Un chiffre
                  </span>
                </li>
              </ul>
            </div>

            <Button
              disabled={loading}
              loading={loading}
              type="submit"
              fullWidth
            >
              Réinitialiser le mot de passe
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;