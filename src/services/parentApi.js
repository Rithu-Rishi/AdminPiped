import API from "../config/api";

const BASE_URL = "/api/parent";

// Fetch all parents
export const getAllParents = async ({ page = 1, per_page = 10, search = "", start_date, end_date }) => {
    try {
        let url = `${BASE_URL}?page=${page}&per_page=${per_page}&search=${encodeURIComponent(search)}`;
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }

        const response = await API.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching parents", error);
        throw error;
    }
};

// Fetch a single parent by ID
export const getParentById = async (id) => {
    try {
        const response = await API.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching parent", error);
        throw error;
    }
};

// Add a new parent (with image upload)
export const addParent = async (parentData) => {
    try {
        const formData = new FormData();
        Object.keys(parentData).forEach((key) => {
            formData.append(key, parentData[key]);
        });

        const response = await API.post(BASE_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding parent", error);
        throw error;
    }
};

// Update an existing parent (with image upload)
export const updateParent = async (id, parentData) => {
    try {
        const formData = new FormData();
        Object.keys(parentData).forEach((key) => {
            formData.append(key, parentData[key]);
        });

        const response = await API.put(`${BASE_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating parent", error);
        throw error;
    }
};

// Delete a parent
export const deleteParent = async (id) => {
    try {
        const response = await API.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting parent", error);
        throw error;
    }
};

// Export/Download parent data
export const downloadParentsCSV = async ({ start_date, end_date, search = "" }) => {
  try {
    let url = `/api/parents/download-excel?search=${encodeURIComponent(search)}`;
    if (start_date && end_date) {
      url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
    }

    const response = await API.get(url, {
      responseType: 'blob', // Important for file download
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading CSV file", error);
    throw error;
  }
};