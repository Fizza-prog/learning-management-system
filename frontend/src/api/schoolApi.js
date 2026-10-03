/**
 * @file schoolApi.js
 * @description Provides HTTP operations for school records.
 *
 * Responsibilities:
 * - Fetch paginated school lists and individual schools.
 * - Create, update, and delete schools.
 */
import axiosInstance from "./axios";

export const getSchools = async (params = {}) => {
  const { data } = await axiosInstance.get("/schools", {
    params,
  });
  return data;
};

export const getSchoolById = async (id) => {
  const { data } = await axiosInstance.get(`/schools/${id}`);
  return data;
};

export const createSchool = async (schoolData) => {
  const { data } = await axiosInstance.post(
    "/schools",
    schoolData
  );
  return data;
};

export const updateSchool = async (id, schoolData) => {
  const { data } = await axiosInstance.patch(
    `/schools/${id}`,
    schoolData
  );
  return data;
};

export const deleteSchool = async (id) => {
  const { data } = await axiosInstance.delete(
    `/schools/${id}`
  );
  return data;
};