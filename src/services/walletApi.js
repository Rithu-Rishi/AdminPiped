import API from "../config/api";

const BASE_URL = "/api/wallet/purchase";

// Add a new admin
export const purchaseItem = async (formData) => {
  try {
    const response = await API.post(BASE_URL, formData);
    return response.data;

  } catch (error) {
    console.error("Error adding admin", error);
    throw error;
  }
};

// Get Wallet Transactions with Filters and Pagination
export const getWalletTransactions = async ({
  user_id = "", transaction_type = "",
  start_date = "", end_date = "", page = 1, per_page = 10,
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (user_id) queryParams.append("user_id", user_id);
    if (transaction_type) queryParams.append("transaction_type", transaction_type);
    if (start_date) queryParams.append("start_date", start_date);
    if (end_date) queryParams.append("end_date", end_date);
    queryParams.append("page", page);
    queryParams.append("per_page", per_page);

    const response = await API.get(`/api/wallet/all-transactions?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    throw error;
  }
};
