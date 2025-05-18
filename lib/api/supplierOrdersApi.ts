/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./axiosInstance";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SupplierOrderProduct {
  productId: string
  quantity: number
}

export interface SupplierOrderProductResponse {
  id: string
  productId: string
  quantity: number
}

export interface CreateSupplierOrderParams {
  supplierId: string
  products: SupplierOrderProduct[]
  status: OrderStatus
}

export interface UpdateSupplierOrderParams {
  supplierId?: string
  products?: SupplierOrderProduct[]
  status?: OrderStatus
}

export interface GetSupplierOrderParams {
  search?: string
  status?: OrderStatus
  startDate?: string    // YYYY-MM-DD
  endDate?: string      // YYYY-MM-DD
  supplierId?: string
  productId?: string
  page?: number
  limit?: number
}

export const getSupplierOrders = async (
  params: GetSupplierOrderParams
): Promise<PaginationAPIResponseData<SupplierOrder>> => {
  try {
    const url = `${apiSuffix}/supplier-orders`
    const response = await apiClient.get<PaginationAPIResponseData<SupplierOrder>>(url, { params })
    return response.data
  } catch (error: any) {
    throw error?.response?.data || error?.message
  }
}

export const getSupplierOrder = async (
  id: string
): Promise<SupplierOrder> => {
  try {
    const url = `${apiSuffix}/supplier-orders/${id}`
    const response = await apiClient.get<SupplierOrder>(url)
    return response.data
  } catch (error: any) {
    throw error?.response?.data || error?.message
  }
}

export const createSupplierOrder = async (
  payload: CreateSupplierOrderParams
): Promise<SupplierOrder> => {
  try {
    const url = `${apiSuffix}/supplier-orders`
    const response = await apiClient.post<SupplierOrder>(url, payload)
    return response.data
  } catch (error: any) {
    throw error?.response?.data || error?.message
  }
}

export const updateSupplierOrder = async (
  id: string,
  payload: UpdateSupplierOrderParams
): Promise<SupplierOrder> => {
  try {
    const url = `${apiSuffix}/supplier-orders/${id}`
    const response = await apiClient.put<SupplierOrder>(url, payload)
    return response.data
  } catch (error: any) {
    throw error?.response?.data || error?.message
  }
}

export const deleteSupplierOrder = async (
  id: string
): Promise<{ deleted: boolean }> => {
  try {
    const url = `${apiSuffix}/supplier-orders/${id}`
    const response = await apiClient.delete<{ deleted: boolean }>(url)
    return response.data
  } catch (error: any) {
    throw error?.response?.data || error?.message
  }
}
