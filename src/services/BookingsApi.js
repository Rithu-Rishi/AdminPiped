import API from "../config/api";

// Fetch all user bookings
export const getUserBookings = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/booking-history?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user bookings", error);
        throw error;
    }
};

// Fetch all Program Transitions

export const getProgramTransactions = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/program-transactions?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("error fetching user bookings", error);
        throw error;
    }
};

// Fetch booking details by Booking ID
export const getBookingDetails = async (bookingId) => {
    try {
        const response = await API.get(`/api/child/booking-details/${bookingId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching booking details", error);
        throw error;
    }
};

// Fetch booking details by Booking ID
export const getProgramSubscriptions = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/program/subscription?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching booking details", error);
        throw error;
    }
};