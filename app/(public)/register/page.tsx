/* eslint-disable @next/next/no-img-element */
"use client"

import AppInput from '@/components/inputs/input';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from '@/lib/schemas/auth.schemas';
import Link from 'next/link';
import { signUp } from '@/lib/server-actions/auth';
import { toast } from 'sonner';
import { handleError } from '@/lib/utils';
import { useLocalization } from '@/providers/localization-provider';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/icons';

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
        throw createResponse.data;
      }
    } catch (error) {
      handleError({ error, message: t.apicodes[1010], dict: t });
    } finally {
      setloading(false);
    }
  };

  return (
    <div className='h-screen w-screen flex'>
      <div className='w-1/2 flex items-center justify-center'
       style={{
        backgroundImage: "url('/close-up-warehouse-view.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      >
        
      </div>
      <div className='w-1/2 bg-cover flex flex-col items-center justify-center gap-8'>
        <div className="w-[360px] h-[146px] flex-col justify-start items-center gap-6 inline-flex">
        <Logo />
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
            loading={loading}
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