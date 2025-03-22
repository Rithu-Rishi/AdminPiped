import API from "../config/api";

const BASE_URL = "/api/coupon";

// Fetch all coupons
export const getAllCoupons = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`${BASE_URL}?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching coupons", error);
        throw error;
    }
};

// Add a new coupon
export const addCoupon = async (couponData) => {
    try {
        const response = await API.post(`${BASE_URL}`, couponData);
        return response.data;
    } catch (error) {
        console.error("Error adding coupon", error);
        throw error;
    }
};

// update an existing coupon
export const updateCoupon = async (id, couponData) => {
    try {
        const response = await API.put(`${BASE_URL}/${id}`, couponData);
        return response.data;
    } catch (error) {
        console.error("Error updating coupon", error);
        throw error;
    }
};

// Delete a coupon
export const deleteCoupon = async (id) => {
    try {
        const response = await API.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting coupon", error);
        throw error;
    }
};

// Toggle Coupon Active Status
export const toggleCouponStatus = async (id) => {
    try {
        const response = await API.patch(`${BASE_URL}/${id}/toggle`);
        return response.data;
    } catch (error) {
        console.error("Error toggling coupon status", error);
        throw error;
    }
};