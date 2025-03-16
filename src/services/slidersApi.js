import API from "../config/api";

const BASE_URL = "/api/front/dashboard/slide";


// Fetch all sliders
export const getAllSliders = async () => {
    try {
        const response = await API.get("/api/front/dashboard");
        return response.data;
    } catch (error) {
        console.error("Error fetching sliders", error);
        throw error;
    }
};

// Add a new slider
export const addSlider = async (sliderData) => {
    try {
        const formData = new FormData();
        formData.append("slider_title", sliderData.slider_title);
        formData.append("slider_caption", sliderData.slider_caption);
        if (sliderData.slide_image) {
            formData.append("slide_image", sliderData.slide_image);
        }

        const response = await API.post(BASE_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding slider", error);
        throw error;
    }
};

// Update an existing slider
export const updateSlider = async (id, sliderData) => {
    try {
        const formData = new FormData();
        formData.append("slider_title", sliderData.slider_title);
        formData.append("slider_caption", sliderData.slider_caption);
        if (sliderData.slide_image) {
            formData.append("slide_image", sliderData.slide_image);
        }

        const response = await API.post(`${BASE_URL}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating slider", error);
        throw error;
    }
};

// Delete a slider
export const deleteSlider = async (id) => {
    try {
        const response = await API.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting slider", error);
        throw error;
    }
};

// Toggle slider status (Activate/Deactivate)
export const toggleSliderStatus = async (id) => {
    try {
        const response = await API.patch(`${BASE_URL}/${id}/toggle`);
        return response.data;
    } catch (error) {
        console.error("Error toggling slider status", error);
        throw error;
    }
};