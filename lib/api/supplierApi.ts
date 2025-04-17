/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./axiosInstance";
import { SupplierFormValues } from "../schemas/supplier.schemas";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface GetSuppliers {
  limit?: number;
  page?: number;
  search?: string;
  onlyDeleted?: boolean;
  includeDeleted?: boolean;
}


export const getSuppliers = async (
  data?: GetSuppliers
): Promise<PaginationAPIResponseData<Supplier>> => {
  try {
    const url = `${apiSuffix}/suppliers`;
    const response = await apiClient.get<PaginationAPIResponseData<Supplier>>(url, { params: data });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const getSupplierById = async (
  id: string
): Promise<{ data: Supplier | any; status: 'success' | 'failure' }> => {
  try {
    const url = `${apiSuffix}/suppliers/${id}`;
    const response = await apiClient.get(url);

    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      status: 'failure',
      data: error?.response?.data || error?.message,
    };
  }
};

export const createSupplier = async (
  dto: SupplierFormValues
): Promise<Supplier> => {
  try {
    const url = `${apiSuffix}/suppliers`;
    const response = await apiClient.post<Supplier>(url, dto);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const importSuppliers = async (
  dto: { suppliers: SupplierFormValues[] }
): Promise<{
  data: {
    created: number;
    updated: number;
    skipped: number;
    logSkipped: string[];
  } | never;
  status: 'success' | 'failure'
}> => {
  try {
    const url = `${apiSuffix}/suppliers/import`;
    const response = await apiClient.post(url, dto);

    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      status: 'failure',
      data: error?.response?.data || error?.message,
    };
  }
};

export const updateSupplier = async (
  id: string,
  dto: Partial<SupplierFormValues>
): Promise<Supplier> => {
  try {
    const url = `${apiSuffix}/suppliers/${id}`;
    const response = await apiClient.patch<Supplier>(url, dto);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const deleteSupplier = async (
  id: string
): Promise<{ data: any; status: 'success' | 'failure' }> => {
  try {
    const url = `${apiSuffix}/suppliers/${id}`;
    const response = await apiClient.delete(url);

    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      status: 'failure',
      data: error?.response?.data || error?.message,
    };
  }
};

export const restoreSupplier = async (
  id: string
): Promise<{ data: Supplier | any; status: 'success' | 'failure' }> => {
  try {
    const url = `${apiSuffix}/suppliers/${id}/restore`;
    const response = await apiClient.patch(url);

    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    return {
      status: 'failure',
      data: error?.response?.data || error?.message,
    };
  }
};