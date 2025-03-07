import API from "../config/api";

// Fetch payment plans with pagination
export const getAllPaymentPlans = async (page = 1) => {
  try {
    const response = await API.get(`/api/payment-plans?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment plans", error);
    throw error;
  }
};

// Add multiple payment plans at once
export const addPaymentPlans = async (plans) => {
  try {
    const response = await API.post("/api/payment-plans", plans);
    return response.data;
  } catch (error) {
    console.error("Error adding payment plans", error);
    throw error;
  }
};

// Update a single payment plan
export const updatePaymentPlan = async (id, planData) => {
  try {
    const response = await API.put(`/api/payment-plans/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error("Error updating payment plan", error);
    throw error;
  }
};

// Delete a payment plan
export const deletePaymentPlan = async (id) => {
  try {
    const response = await API.delete(`/api/payment-plans/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting payment plan", error);
    throw error;
  }
};
