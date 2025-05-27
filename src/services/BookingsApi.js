import API from "../config/api";

// Fetch all user bookings
export const getUserBookings = async ({ page = 1, per_page = 10, search = "", start_date, end_date }) => {
    try {
        let url = `/api/booking-history?page=${page}&per_page=${per_page}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }
        const response = await API.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user bookings", error);
        throw error;
    }
};

// Fetch all Program Transitions

export const getProgramTransactions = async ({ page = 1, per_page = 10, search = "", start_date, end_date }) => {
    try {
        let url = `/api/program-transactions?page=${page}&per_page=${per_page}&search=${encodeURIComponent(search)}`;
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }
        const response = await API.get(url);
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
export const getProgramSubscriptions = async ({ page = 1, per_page = 10, search = "", start_date, end_date }) => {
    try {
        let url = `/api/program/subscription?page=${page}&per_page=${per_page}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }
        const response = await API.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching booking details", error);
        throw error;
    }
};

// Fetch Programs by Parents grouped details
export const getParentGroupedDetails = async (params) => {
    try {
        const queryParams = new URLSearchParams(params).toString();
        const response = await API.get(`/api/bookings/parent?${queryParams}`);
        return response.data;
    }
    catch (error) {
        console.error("Error fetching parent grouped details", error);
        throw error;
    }
};

// Export Program Transactions to CSV
export const exportProgramTransactionCSV = async ({ page = 1, per_page = 10, search = "", start_date, end_date }) => {
    try {
        let url = `/api/export/program-transactions?page=${page}&per_page=${per_page}&search=${encodeURIComponent(search)}`;
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }
        const response = await API.get(url, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error("error fetching user bookings", error);
        throw error;
    }
};

// Export Program Subscriptions to CSV
export const exportProgramSubscriptionCSV = async ({ page = 1, per_page = 10, search = "", start_date, end_date }) => {
    try {
        let url = `/api/export/program-subscriptions?page=${page}&per_page=${per_page}&search=${encodeURIComponent(search)}`;
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }
        const response = await API.get(url, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error("error fetching user bookings", error);
        throw error;
    }
};

// Export Booking History to CSV
export const exportBookingHistoryCSV = async ({ page = 1, per_page = 10, search = "", start_date, end_date }) => {
    try {
        let url = `/api/export/booking-history?page=${page}&per_page=${per_page}&search=${encodeURIComponent(search)}`;
        if (start_date && end_date) {
            url += `&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}`;
        }
        const response = await API.get(url, {
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        console.error("error fetching user bookings", error);
        throw error;
    }
};