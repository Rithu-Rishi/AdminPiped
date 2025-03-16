import API from "../config/api";

const BASE_URL = "/api/front/dashboard/notice";

// Get all notices
export const getAllNotices = async () => {
    try {
        const response = await API.get("/api/front/dashboard");
        return response.data;
    } catch (error) {
        console.error("Error fetching notices", error);
        throw error;
    }
};

// Add a new notice
export const addNotice = async (noticeData) => {
    try {
        const response = await API.post(BASE_URL, noticeData);
        return response.data;
    } catch (error) {
        console.error("Error adding notice", error);
        throw error;
    }
};

// Update an existing notice
export const updateNotice = async (id, noticeData) => {
    try {
        const response = await API.put(`${BASE_URL}/${id}`, noticeData);
        return response.data;
    } catch (error) {
        console.error("Error updating notice", error);
        throw error;
    }
};

// Delete a notice
export const deleteNotice = async (id) => {
    try {
        const response = await API.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting notice", error);
        throw error;
    }
};

// Toggle Notice Active Status
export const toggleNoticeStatus = async (id) => {
    try {
        const response = await API.patch(`${BASE_URL}/${id}/toggle`);
        return response.data;
    } catch (error) {
        console.error("Error toggling notice status", error);
        throw error;
    }
};