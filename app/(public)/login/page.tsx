"use client"
/* eslint-disable @next/next/no-img-element */
import AppInput from '@/components/inputs/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from '@/lib/schemas/auth.schemas';
import { sendResetPwdEmail } from '@/lib/server-actions/auth';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils';
import { useLocalization } from '@/providers/localization-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSession, signIn } from 'next-auth/react';
import { Logo } from '@/components/icons';
import { setAuthTokens } from '@/lib/authTokens';

const SignIn = () => {

  const [loading, setloading] = useState(false);
  const { t } = useLocalization();
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    control,
    formState: { errors },
  } = useForm<LoginSchema>({
    shouldUnregister: true,
    resolver: zodResolver(LoginSchema),
  });


  const onSubmit: SubmitHandler<LoginSchema> = async (payload) => {
    try {
      setloading(true);
      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });
      const session = await getSession()
      if (result?.ok && session) {
        setAuthTokens(session.backendTokens)
        return;
        router.push('/overview')
      } else {
        throw result?.error;
      }
    } catch (error) {
      console.log(error)
      handleError({ error, message: "Login failed", dict: t });
    } finally {
      setloading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      setloading(true);
      const result = await sendResetPwdEmail({ email: getValues().email });
      if (result.status === 'success') {
        toast.success("Email envoyé avec succès",);
      } else {
        throw result.data;
      }
    } catch (error) {
      handleError({ error, message: "An error occured", dict: t });
    } finally {
      setloading(false);
    }
  };

  return (
    <div className='h-screen w-screen flex'>
      <div className='w-1/2 flex items-center justify-center'
        style={{
          backgroundImage: "url('/vast-storage-building-full-products-placed-industrial-racks-with-tag.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >

      </div>
      <div className='w-1/2 bg-cover flex flex-col items-center justify-center gap-8'>
        <div className="w-[360px] h-[146px] flex-col justify-start items-center gap-6 inline-flex">
          <Logo />
          <div className="self-stretch h-[74px] flex-col justify-start items-start gap-3 flex">
            <div className="self-stretch text-center text-gray-800 text-3xl font-semibold">Log in to your account</div>
            <div className="self-stretch text-center text-gray-500 text-base font-normal">Welcome back! Please enter your details.</div>
          </div>
        </div>
        <div className="w-96 flex-col justify-center items-center gap-6 flex">
          <AppInput
            label="Email"
            type="email"
            variant={errors.email?.message ? "error" : "primary"}
            placeholder="ex : john.doe@roomee.io"
            errorText={
              errors.email?.message
            }
            hooksformvalidation={{
              ...register("email", {
              }),
            }}
            onChange={(e) => {
              setValue("email", e.target.value?.toLowerCase());
            }}
          />
          <AppInput
            label="Mot de passe"
            variant={errors.password?.message ? "error" : "primary"}
            type="password"
            placeholder="---------"
            errorText={
              errors.password?.message
            }
            hooksformvalidation={{
              ...register("password", {
              }),
            }}
            onChange={(e) => {
              setValue("password", e.target.value);
            }}
          />
          <div className="self-stretch justify-between items-center inline-flex ">
            <div className='flex items-center gap-2'>
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <small>Se souvenir de moi</small>
            </div>

            <button
              className="text-blue-700 text-sm"
              onClick={() => {
                if (getValues().email) {
                  handlePasswordReset()
                } else {
                  trigger('email')
                }
              }}
            >
              Mot de passe oublié
            </button>
          </div>
          <Button
            fullWidth
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >Se connecter</Button>
        </div>
        <div className="justify-center items-center gap-3 inline-flex">
          <div className="text-neutral-800 text-sm font-normal">Pas encore de compte ?</div>
          <Link href={"/register"} className="text-primary text-sm font-medium">Inscrivez-vous</Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn