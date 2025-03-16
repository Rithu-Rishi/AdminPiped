import API from "../config/api";

const BASE_URL = "/api/front/dashboard/offer";

// Fetch all offers
export const getAllOffers = async () => {
    try {
        const response = await API.get("/api/front/dashboard");
        return response.data;
    } catch (error) {
        console.error("Error fetching offers", error);
        throw error;
    }
};

// Add a new offer
export const addOffer = async (offerData) => {
    try {
        const formData = new FormData();
        formData.append("link", offerData.link);
        if (offerData.image) {
            formData.append("image", offerData.image);
        }
        formData.append("is_active", offerData.is_active ? 1 : 0);

        const response = await API.post(BASE_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding offer", error);
        throw error;
    }
};

// Update an existing offer
export const updateOffer = async (id, offerData) => {
    try {
        const formData = new FormData();
        formData.append("link", offerData.link);
        if (offerData.image instanceof File) {
            formData.append("image", offerData.image);
        }
        formData.append("is_active", offerData.is_active ? 1 : 0);

        const response = await API.post(`${BASE_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating offer", error);
        throw error;
    }
};

// Delete a offer
export const deleteOffer = async (id) => {
    try {
        const response = await API.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting offer", error);
        throw error;
    }
};

// Toggle offer active status
export const toggleOfferStatus = async (id) => {
    try {
        const response = await API.patch(`${BASE_URL}/${id}/toggle`);
        return response.data;
    } catch (error) {
        console.error("Error toggling offer status", error);
        throw error;
    }
};