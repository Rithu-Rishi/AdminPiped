import API from "../config/api";

const BASE_URL = "/api/child";

// Fetch all children
export const getAllChildren = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`${BASE_URL}?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching children", error);
        throw error;
    }
};

// Fetch a single child by ID
export const getChildById = async (id) => {
    try {
        const response = await API.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching child", error);
        throw error;
    }
};

// Add a new child (with image upload)
export const addChild = async (childData) => {
    try {
        const formData = new FormData();
        Object.keys(childData).forEach((key) => {
            formData.append(key, childData[key]);
        });
        
        const response = await API.post(BASE_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding child", error);
        throw error;
    }
};

// Update an existing child (with image upload)
export const updateChild = async (id, childData) => {
    try {
        const formData = new FormData();
        Object.keys(childData).forEach((key) => {
            formData.append(key, childData[key]);
        });
        
        const response = await API.put(`${BASE_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating child", error);
        throw error;
    }
};

// Delete a child
export const deleteChild = async (id) => {
    try {
        const response = await API.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting child", error);
        throw error;
    }
};
