import API from "../config/api";

// Fetch all user bookings
export const getUserBookings = async () => {
    try {
        const response = await API.get("/api/booking-history");
        return response.data;
    } catch (error) {
        console.error("Error fetching user bookings", error);
        throw error;
    }
};

// Fetch all Program Transitions

export const getProgramTransactions = async () => {
    try {
        const response = await API.get("/api/program-transactions");
        return response.data;
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
export const getProgramSubscriptions = async (page = 1) => {
    try {
        const response = await API.get(`/api/program/subscription?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching booking details", error);
        throw error;
    }
};