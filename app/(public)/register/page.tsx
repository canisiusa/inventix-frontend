/* eslint-disable @next/next/no-img-element */
"use client"

import AppInput from '@/components/inputs/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from '@/lib/schemas/auth.schemas';
import Link from 'next/link';
import { signUp } from '@/lib/actions/auth';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils';
import { useLocalization } from '@/providers/localization-provider';
import { useRouter } from 'next/navigation';

const SignUp = () => {

  const { t } = useLocalization()

  const [loading, setloading] = useState(false);
  const router = useRouter()

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterSchema>({
    shouldUnregister: true,
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchema> = async (payload) => {
    try {
      setloading(true);
      const createResponse = await signUp(payload);
      if (createResponse.status === "success") {
        toast.success(t.register_successfull)
        router.push("/login")
      } else if (createResponse.status === "failure") {
        throw new Error(createResponse.data);
      }
    } catch (error) {
      handleError({ error, message: t.apicodes[1010], dict: t });
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
            <div className="self-stretch text-center text-gray-800 text-3xl font-semibold">Create an account</div>
            <div className="self-stretch text-center text-gray-500 text-base font-normal">Start your 30-day free trial..</div>
          </div>
        </div>
        <form className="w-96 flex-col justify-center items-center gap-6 flex">
          <AppInput
            label="Business name"
            variant={errors.businessname?.message ? "error" : "primary"}
            containerClassName="w-full"
            labelClassName="text-slate-700 text-sm font-medium "
            errorText={errors.businessname?.message}
            onChange={(e) => {
              setValue("businessname", e.target.value?.toLowerCase());
            }}
          />
          <AppInput
            label="Your fullname"
            variant={errors.name?.message ? "error" : "primary"}
            containerClassName="w-full"
            labelClassName="text-slate-700 text-sm font-medium "
            errorText={errors.name?.message}
            onChange={(e) => {
              setValue("name", e.target.value?.toLowerCase());
            }}
          />
          <AppInput
            label="Your Email"
            type="email"
            variant={Object.keys(errors).length > 0 ? "error" : "primary"}
            containerClassName="w-full"
            labelClassName="text-slate-700 text-sm font-medium "
            placeholder="ex : john.doe@roomee.io"
            errorText={errors.email?.message}
            onChange={(e) => {
              setValue("email", e.target.value?.toLowerCase());
            }}
          />
          <AppInput
            label="Your Password"
            containerClassName="w-full"
            variant={Object.keys(errors).length > 0 ? "error" : "primary"}
            type="password"
            labelClassName="text-slate-700 text-sm font-medium"
            placeholder="--------"
            errorText={errors.password?.message}
            onChange={(e) => {
              setValue("password", e.target.value);
            }}
          />
          <Button
            onClick={handleSubmit(onSubmit)}
            className='w-full'
            isLoading={loading}
          >
            S&apos;inscrire
          </Button>
        </form>
        <div className="h-5 justify-center items-start gap-1 inline-flex">
          <div className="text-gray-500 text-sm font-normal">Already have an account?</div>
          <Link href="/login" className="text-primary text-sm font-medium">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp