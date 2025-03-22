import API from "../config/api";

const FACILITY_PACKAGE_BASE_URL = "/api/facility-payment-plans";

// Fetch all facility payment plans
export const getAllFacilityPlans = async () => {
    try {
        const response = await API.get(FACILITY_PACKAGE_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility payment plans", error);
        throw error;
    }
};

// Fetch a single facility plan by ID
export const getFacilityPlanById = async (id) => {
    try {
        const response = await API.get(`${FACILITY_PACKAGE_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facility payment plan", error);
        throw error;
    }
};

// Add a new facility payment plan
export const addFacilityPlan = async (planData) => {
    try {
        const response = await API.post(FACILITY_PACKAGE_BASE_URL, planData);
        return response.data;
    } catch (error) {
        console.error("Error adding facility payment plan", error);
        throw error;
    }
};

// Update an existing facility payment plan
export const updateFacilityPlan = async (id, planData) => {
    try {
        const response = await API.put(`${FACILITY_PACKAGE_BASE_URL}/${id}`, planData);
        return response.data;
    } catch (error) {
        console.error("Error updating facility payment plan", error);
        throw error;
    }
};

// Delete a facility payment plan
export const deleteFacilityPlan = async (id) => {
    try {
        const response = await API.delete(`${FACILITY_PACKAGE_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting facility payment plan", error);
        throw error;
    }
};

// Fetch all facility user payments
export const getFacilityUserPayments = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/payments/facility?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching facility payment plans", error);
        throw error;
    }
};

// Fetch all facility subscriptions
export const getFacilityUserSubscriptions = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/subscriptions/facility?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching facility payment plans", error);
        throw error;
    }
};