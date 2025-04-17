/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./axiosInstance";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface GetProducts {
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

interface GetLowStockProducts extends GetProducts {
  threshold?: number;
};
export const getLowStockProducts = async (data?: GetLowStockProducts):Promise<{
  data: PaginationAPIResponseData<Product>;
  status: 'success' | 'failure';
}> => {
  try {
    const url = `${apiSuffix}/product/low-stock`;

    const response = await apiClient.get<PaginationAPIResponseData<Product>>(url, {
      params: {
        ...data,
      },
    });

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


export const getProducts = async (data?:GetProducts ):Promise<{
  data: PaginationAPIResponseData<Product>;
  status: 'success' | 'failure';
}> => {
  try {
    const url = `${apiSuffix}/product`;

    const response = await apiClient.get<PaginationAPIResponseData<Product>>(url, {
      params: {
        ...data,
      },
    });

    return {
      data: response.data,
      status: 'success',
    };
  } catch (error: any) {
    console.log(error)
    return {
      status: 'failure',
      data: error?.response?.data || error?.message,
    };
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
    throw error?.response?.data || error?.message;
    return {
      status: "failure",
      data: error?.response?.data || error?.message,
    };
  }
};
