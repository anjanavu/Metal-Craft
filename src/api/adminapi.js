import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "./axiosIntercepter";
const baseURL = import.meta.env.VITE_APP_BASE_URL;
export const getLogin = async (datas) => {
  try {
    const response = await axios.post(`${baseURL}admin/login`, datas);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
export const getAdminById = async () => {
  try {
    const response = await axiosInstance.get(`/admin`);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};

export const getSingleAdmin = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
export const addAdmin = async (data) => {
  try {
    const response = await axiosInstance.post(`/admin`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getAdmin = async (filter) => {
  try {
    const response = await axiosInstance.get(`/admin/list`, {
      params: filter,
    });
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};

export const editAdmin = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/admin/profile/${id}`, data);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const deleteAdmin = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/profile/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getLogs = async () => {
  try {
    const response = await axiosInstance.get(`/admin/log`);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
export const getAlarm = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/alert/${id}`);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
export const getAlarmDownload = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/alerts/download/${id}`);
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getDashboardData = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/dashboard`);
    return response.data;
  } catch (error) {
    console.error(error.response.data.message);
  }
};
export const forgotPassword = async (datas) => {
  try {
    const response = await axios.post(`${baseURL}admin/forget-password`, datas);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};
export const changePassword = async (datas) => {
  try {
    const response = await axios.put(`${baseURL}admin/change-password`, datas);

    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    throw error;
  }
};
