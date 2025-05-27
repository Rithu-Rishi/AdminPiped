import API from "../config/api";

const BASE_URL = "/api/child";

// Fetch all children
export const getAllChildren = async ({ page = 1, per_page = 10, search = "", start_date, end_date, status }) => {
    try {
        let url = `${BASE_URL}?page=${page}&per_page=${per_page}&search=${encodeURIComponent(search)}`;

        if (status) url += `&status=${status}`;
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }
        const response = await API.get(url);
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

// Export CSV

export const exportChildrenCSV = async ({ search, start_date, end_date, status = "" }) => {
    try {
        let url = `/api/child/download-excel?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`;

        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }

        const response = await API.get(url, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error("Error exporting children", error);
        throw error;
    }
};