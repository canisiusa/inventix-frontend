/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddCategoryInputs, EditCategoryInputs } from "../schemas/category.schemas";
import apiClient from "./axiosInstance";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;


export const getCategories = async (): Promise<Category[]> => {
  try {
    const url = `${apiSuffix}/category`;
    const response = await apiClient.get<Category[]>(url);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const getCategoryById = async (
  id: string
): Promise<Category> => {
  try {
    const url = `${apiSuffix}/category/${id}`;
    const response = await apiClient.get<Category>(url);

    return response.data;

  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const createCategory = async (
  dto: AddCategoryInputs
): Promise<Category> => {
  try {
    const url = `${apiSuffix}/category`;
    const response = await apiClient.post<Category>(url, dto);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};


export const updateCategory = async (
  id: string,
  dto: Partial<EditCategoryInputs>
): Promise<Category> => {
  try {
    const url = `${apiSuffix}/category/${id}`;
    const response = await apiClient.patch<Category>(url, dto);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};

export const deleteCategory = async (
  id: string
): Promise<Category> => {
  try {
    const url = `${apiSuffix}/category/${id}`;
    const response = await apiClient.delete(url);

    return response.data;
  } catch (error: any) {
    throw error?.response?.data || error?.message;
  }
};
