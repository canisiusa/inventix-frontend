"use client"
/* eslint-disable @next/next/no-img-element */
import AppInput from '@/components/inputs/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from '@/lib/schemas/auth.schemas';
import { sendResetPwdEmail } from '@/lib/actions/auth';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils';
import { useLocalization } from '@/providers/localization-provider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

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
      if (result?.ok) {
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
      <div className='w-1/2 flex items-center justify-center'>
        <img src="/logo-1.png" alt="" />
      </div>
      <div className='w-1/2 bg-cover flex flex-col items-center justify-center gap-8'>
        <div className="w-[360px] h-[146px] flex-col justify-start items-center gap-6 inline-flex">
          <div data-svg-wrapper className="relative">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 3.97388L44.7846 14.9804V36.9935L24 48.0001L3.21539 36.9935V14.9804L24 3.97388Z" fill="#009ED8" />
              <path d="M14.3555 31.6875V12.0823C16.592 9.53186 18.6374 11.0196 19.3806 12.0823V21.2069L42.4834 0.0992135C45.6476 -0.49444 46.1391 1.72076 45.9892 2.90257L14.3555 31.6875Z" fill="#0ACF83" />
              <path d="M14.3555 41.7611V35.5538L19.9253 30.7197L23.2193 33.6311L14.3555 41.7611Z" fill="white" />
              <path d="M36.4584 41.4139L22.2012 28.3576L35.6765 15.888C39.5095 15.4925 39.5095 17.8472 39.0304 19.0741L28.9322 28.3576L40.7824 39.1222L36.4584 41.4139Z" fill="white" />
            </svg>
          </div>
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