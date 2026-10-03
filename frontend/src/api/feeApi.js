/**
 * @file feeApi.js
 * @description Provides HTTP operations for fee records.
 *
 * Responsibilities:
 * - Fetch fee lists with query parameters.
 * - Create, update, and delete fee records.
 */
import axiosInstance from "./axios";

export const getFees = async (params = {}) => {
  const { data } = await axiosInstance.get("/fees", { params });
  return data;
};

export const createFee = async (fee) => {
  const { data } = await axiosInstance.post("/fees", fee);
  return data;
};

export const updateFee = async (id, fee) => {
  const { data } = await axiosInstance.put(`/fees/${id}`, fee);
  return data;
};

export const deleteFee = async (id) => {
  const { data } = await axiosInstance.delete(`/fees/${id}`);
  return data;
};