/**
 * @file announcementApi.js
 * @description Provides HTTP operations for school announcements.
 *
 * Responsibilities:
 * - Fetch announcement lists and individual records.
 * - Create, update, and delete announcements.
 */
import axiosInstance from "./axios";

export const getAnnouncements = async (params = {}) => {
  const { data } = await axiosInstance.get("/announcements", { params });
  return data;
};

export const getAnnouncementById = async (id) => {
  const { data } = await axiosInstance.get(`/announcements/${id}`);
  return data;
};

export const createAnnouncement = async (announcement) => {
  const { data } = await axiosInstance.post("/announcements", announcement);
  return data;
};

export const updateAnnouncement = async (id, announcement) => {
  const { data } = await axiosInstance.put(`/announcements/${id}`, announcement);
  return data;
};

export const deleteAnnouncement = async (id) => {
  const { data } = await axiosInstance.delete(`/announcements/${id}`);
  return data;
};