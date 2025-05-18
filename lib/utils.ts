/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { toast } from "@/hooks/use-toast";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getIpLocationData = async () => {
  let ipapiData: IpInfo | null = null;
  try {
    const ipapiResponse = await fetch(
      `https://api.ipapi.com/api/check?access_key=${process.env.NEXT_PUBLIC_IPAPI_KEY}`
    );
    if (ipapiResponse.ok) {
      ipapiData = await ipapiResponse.json();
    }
  } catch (ipapiError) {
    console.warn('Ipapi API failed:', ipapiError);
  }

  return ipapiData;
};

export const handleError = async ({ error, message, dict }: { error: unknown, message: string, dict: Record<string, any> }) => {
  if (error === 'cancel' || error === 'abort' || error === 'timeout') return;
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const apiError = error as ApiResponseError;
    toast({
      description: dict.apicodes[apiError.code as any],
      variant: "destructive",
    });
  } else {
    toast({
      description: message,
      variant: "destructive",
    });
  }
};