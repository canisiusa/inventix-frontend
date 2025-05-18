/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { UpdateUserSchema } from "../schemas/user.schemas";
import apiClient from "./axiosInstance(server)";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export const editProfile = async (data: UpdateUserSchema) => {
  try {
    const url = `${apiSuffix}/user/profile`;

    const response = await apiClient.patch(url, data);
    const responseData = await response.data;

    return {
      data: responseData,
      status: "success",
    };
  } catch (error:any) {
    return  {
      status: "failure",
      data: error?.response?.data || error?.message,
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const url = `${apiSuffix}/user/current`;

    const response = await apiClient.get(url);
    const responseData = await response.data;

    return {
      data: responseData,
      status: "success",
    };
  } catch (error:any) {
    return  {
      status: "failure",
      data: error?.response?.data || error?.message,
    };
  }
};