import API from "../config/api";

const BASE_URL = "/api/wallet/purchase";

// Add a new admin
export const purchaseItem = async (formData) => {
  try {
    const response = await API.post(BASE_URL, formData);
    console.log(response.data);
    return response.data;
   
  } catch (error) {
    console.error("Error adding admin", error);
    throw error;
  }
};
