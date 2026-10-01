/**
 * @file userApi.js
 * @description Provides HTTP operations for user records.
 *
 * Responsibilities:
 * - Fetch users and individual user records.
 * - Create, update, and delete users.
 */
import axiosInstance from "./axios";

export const getUsers = async (params = {}) => {
  const { data } = await axiosInstance.get("/users", {
    params,
  });

  return data;
};

export const getUserById = async (id) => {
  const { data } = await axiosInstance.get(`/users/${id}`);

  return data;
};

export const createUser = async (userData) => {
  const { data } = await axiosInstance.post(
    "/users",
    userData
  );

  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await axiosInstance.patch(
    `/users/${id}`,
    userData
  );

  return data;
};

export const deleteUser = async (id) => {
  const { data } = await axiosInstance.delete(
    `/users/${id}`
  );

  return data;
};