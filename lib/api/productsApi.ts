/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddProductSchema } from "../schemas/inventory.schemas";
import apiClient from "./axiosInstance";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface GetProducts {
  limit?: number;
  page?: number;
  search?: string;
  categoryId?: string;
  supplierId?: string;
  warehouseId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  exportCsv?: boolean;
}

interface GetLowStockProducts extends GetProducts {
  threshold?: number;
};
export const getLowStockProducts = async (data?: GetLowStockProducts): Promise<PaginationAPIResponseData<Product>> => {
  try {
    const url = `${apiSuffix}/product/low-stock`;

    const response = await apiClient.get<PaginationAPIResponseData<Product>>(url, {
      params: {
        ...data,
      },
    });

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.message;
  }
};


export const getProducts = async (data?: GetProducts): Promise<PaginationAPIResponseData<Product>> => {
  try {
    const url = `${apiSuffix}/product`;

    const response = await apiClient.get<PaginationAPIResponseData<Product>>(url, {
      params: {
        ...data,
      },
    });
    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.message;
  }
};

interface GetTopSellingProducts extends GetProducts {
  startDate?: Date;
  endDate?: Date;
  minSales?: number;
};
export const getTopSellingProducts = async (data?: GetTopSellingProducts): Promise<PaginationAPIResponseData<Product>> => {
  try {
    const url = `${apiSuffix}/product/top-selling`;

    const response = await apiClient.get<PaginationAPIResponseData<Product>>(url, {
      params: {
        ...data,
      },
    });

    return response.data;
  } catch (error: any) {
    return error?.response?.data || error?.message;
  }
};


export const getOverallInventory = async () => {
  try {
    const url = `${apiSuffix}/overview/products/last-7-days`;
    const response = await apiClient.get<{
      categories: number;
      totalProducts: number;
      revenue: number;
      topSelling: number;
      topSellingCost: number;
      lowStocks: {
        totalOrdered: number;
        notInStock: number;
      };
    }>(url);

    return {
      data: response.data,
      status: "success",
    };
  } catch (error: any) {
    return {
      status: "failure",
      data: error?.response?.data || error?.message,
    };
  }
};



export const createProduct = async (
  dto: AddProductSchema
): Promise<Category> => {
  try {
    const url = `${apiSuffix}/product`;
    const response = await apiClient.post<Category>(url, dto);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const url = `${apiSuffix}/product/${id}`;
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const updateProduct = async (
  id: string,
  dto: Partial<AddProductSchema>
): Promise<Category> => {
  try {
    const url = `${apiSuffix}/product/${id}`;
    const response = await apiClient.put<Category>(url, dto);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};