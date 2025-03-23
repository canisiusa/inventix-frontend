'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "../config/apiClient";

const apiSuffix = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getOverview = async () => {
  try {
    const url = `${apiSuffix}/overview`;
    const response = await apiClient.get(url);
    const responseData = await response.data;

    return {
      data: responseData,
      status: "success",
    };
  } catch (error: any) {
    return {
      status: "failure",
      data: error?.response?.data || error?.message,
    };
  }
};

export const getOverviewChartData = async (queryParams: {
  period: "monthly" | "weekly",
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const url = `${apiSuffix}/overview/trends`;
    const response = await apiClient.get(url, { params: queryParams });
    const responseData = await response.data;

    return {
      data: responseData,
      status: "success",
    };
  } catch (error: any) {
    return {
      status: "failure",
      data: error?.response?.data || error?.message,
    };
  }
};