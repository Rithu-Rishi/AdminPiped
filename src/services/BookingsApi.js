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