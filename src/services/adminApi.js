import API from "../config/api";

const BASE_URL = "/api/admin";

// Get all admins with pagination and search
export const getAllAdmins = async ({ page = 1, per_page = 10, search = "" }) => {
  try {
    const response = await API.get(`${BASE_URL}?page=${page}&per_page=${per_page}&search=${search}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching admins", error);
    throw error;
  }
};

// Add a new admin
export const addAdmin = async (formData) => {
  try {
    const response = await API.post(BASE_URL, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding admin", error);
    throw error;
  }
};

// Update admin by ID
export const updateAdmin = async (id, formData) => {
  try {
    const response = await API.post(`${BASE_URL}/${id}?_method=PUT`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating admin", error);
    throw error;
  }
};

// Delete admin by ID
export const deleteAdmin = async (id) => {
  try {
    const response = await API.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting admin", error);
    throw error;
  }
};

// Get all Supports with pagination and search
export const getHelpSupportQueries = async ({ page = 1, per_page = 10, search = "" }) => {
  try {
    const response = await API.get(`/api/help-support/get?page=${page}&per_page=${per_page}&search=${search}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching admins", error);
    throw error;
  }
};