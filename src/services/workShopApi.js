import API from "../config/api";

const BASE_URL = "/api/front/dashboard/workshop";


// Fetch all workshops
export const getAllWorkshops = async () => {
    try {
        const response = await API.get("/api/front/dashboard");
        return response.data;
    } catch (error) {
        console.error("Error fetching workshops", error);
        throw error;
    }
};

// Add a new workshop
export const addWorkshop = async (workshopData) => {
    try {
        const formData = new FormData();
        formData.append("workshop_name", workshopData.workshop_name);
        formData.append("date", workshopData.date);
        formData.append("time", workshopData.time);
        formData.append("link", workshopData.link);
        if (workshopData.image) {
            formData.append("image", workshopData.image);
        }
        formData.append("is_active", workshopData.is_active ? 1 : 0);

        const response = await API.post(BASE_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding workshop", error);
        throw error;
    }
};

// Update an existing workshop
export const updateWorkshop = async (id, workshopData) => {
    try {
        const formData = new FormData();
        formData.append("workshop_name", workshopData.workshop_name);
        formData.append("date", workshopData.date);
        formData.append("time", workshopData.time);
        formData.append("link", workshopData.link);
        if (workshopData.image instanceof File) {
            formData.append("image", workshopData.image);
        }
        formData.append("is_active", workshopData.is_active ? 1 : 0);

        const response = await API.post(`${BASE_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating workshop", error);
        throw error;
    }
};

// Delete a workshop
export const deleteWorkshop = async (id) => {
    try {
        const response = await API.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting workshop", error);
        throw error;
    }
};

// Toggle workshop active status
export const toggleWorkshopStatus = async (id) => {
    try {
        const response = await API.patch(`${BASE_URL}/${id}/toggle`);
        return response.data;
    } catch (error) {
        console.error("Error toggling workshop status", error);
        throw error;
    }
};