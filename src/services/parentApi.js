import API from "../config/api";

const BASE_URL = "/api/parent";

// Fetch all parents
export const getAllParents = async () => {
    try {
        const response = await API.get(BASE_URL);
        return response.data;
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
