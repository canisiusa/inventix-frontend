/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddStockMovementDto, WarehouseFormValues } from "../schemas/warehouse.schemas";
import apiClient from "./axiosInstance";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface GetWarehouses {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
}

export const getWarehouses = async (params?: GetWarehouses): Promise<{
  data: PaginationAPIResponseData<Warehouse> | never;
  status: 'success' | 'failure';
}> => {
  try {
    const url = `${apiSuffix}/warehouses`;
    const response = await apiClient.get<PaginationAPIResponseData<Warehouse>>(url, { params });
    return { data: response.data, status: 'success' };
  } catch (error: any) {
    return { status: 'failure', data: error?.response?.data || error?.message };
  }
};

export const getWarehouse = async (id: string): Promise<{
  data: Warehouse | never;
  status: 'success' | 'failure';
}> => {
  try {
    const url = `${apiSuffix}/warehouses/${id}`;
    const response = await apiClient.get(url);
    return { data: response.data, status: 'success' };
  } catch (error: any) {
    return { status: 'failure', data: error?.response?.data || error?.message };
  }
};

export const createWarehouse = async (data: WarehouseFormValues): Promise<{
  data: Warehouse | never;
  status: 'success' | 'failure';
}> => {
  try {
    const url = `${apiSuffix}/warehouses`;
    const response = await apiClient.post(url, data);
    return { data: response.data, status: 'success' };
  } catch (error: any) {
    return { status: 'failure', data: error?.response?.data || error?.message };
  }
};

export const updateWarehouse = async (id: string, data: WarehouseFormValues): Promise<{
  data: Warehouse | never;
  status: 'success' | 'failure';
}> => {
  try {
    const url = `${apiSuffix}/warehouses/${id}`;
    const response = await apiClient.patch(url, data);
    return { data: response.data, status: 'success' };
  } catch (error: any) {
    return { status: 'failure', data: error?.response?.data || error?.message };
  }
};

export const deleteWarehouse = async (id: string): Promise<{
  data: any;
  status: 'success' | 'failure';
}> => {
  try {
    const url = `${apiSuffix}/warehouses/${id}`;
    const response = await apiClient.delete(url);
    return { data: response.data, status: 'success' };
  } catch (error: any) {
    return { status: 'failure', data: error?.response?.data || error?.message };
  }
};

interface GetWarehouseStockParams {
  limit?: number;
  page?: number;
  search?: string;
  categoryId?: string;
  supplierId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  exportCsv?: boolean;
}
export const getWarehouseStock = async (id: string, params: GetWarehouseStockParams) => {
  try {
    const url = `${apiSuffix}/warehouses/${id}/stock`;
    const response = await apiClient.get<PaginationAPIResponseData<Stock>>(url, { params });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export interface GetWarehouseMovementParams {
  limit?: number;
  page?: number;
  search?: string;
  type?: MovementType;
  startDate?: string;
  endDate?: string;
  exportCsv?: boolean;
}
export const getWarehouseMovements = async (id: string, params: GetWarehouseMovementParams) => {
  try {
    const url = `${apiSuffix}/warehouses/${id}/movements`;
    const response = await apiClient.get<PaginationAPIResponseData<StockMovement>>(url, {
      params,
      ...(params.exportCsv ? { responseType: 'blob' } : {})
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const addStockMovement = async (data: AddStockMovementDto) => {
  try {
    const url = `${apiSuffix}/warehouses/stock-movements`;
    const response = await apiClient.post(url, data);
    return { data: response.data, status: 'success' };
  } catch (error: any) {
    return { status: 'failure', data: error?.response?.data || error?.message };
  }
};
