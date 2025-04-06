import API from "../config/api";

const BASE_URL = "/api/cafeteria";

// Fetch all cafeteria items with pagination and search
export const getAllCafeteriaItems = async ({ page = 1, per_page = 10, search = "" }) => {
  try {
    const response = await API.get(`${BASE_URL}?page=${page}&per_page=${per_page}&search=${search}&with_deleted=false`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cafeteria items", error);
    throw error;
  }
};

export const getCafeteriaItems = async () => {
  try {
    const response = await API.get(`${BASE_URL}?with_deleted=false`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cafeteria items", error);
    throw error;
  }
};

// Add a new cafeteria item
export const addCafeteriaItem = async (data) => {
  try {
    const formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    const response = await API.post(`${BASE_URL}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("Error adding cafeteria item", error);
    throw error;
  }
};

// Update existing cafeteria item
export const updateCafeteriaItem = async (id, data) => {
  try {
    const formData = new FormData();
    for (let key in data) {
      if (key === "image" && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (key !== "image") {
        formData.append(key, data[key]);
      }
    }
    const response = await API.post(`${BASE_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cafeteria item", error);
    throw error;
  }
};

// Soft delete
export const deleteCafeteriaItem = async (id) => {
  try {
    const response = await API.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting cafeteria item", error);
    throw error;
  }
};

// Restore
export const restoreCafeteriaItem = async (id) => {
  try {
    const response = await API.post(`${BASE_URL}/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error("Error restoring cafeteria item", error);
    throw error;
  }
};

// Force delete
export const forceDeleteCafeteriaItem = async (id) => {
  try {
    const response = await API.delete(`${BASE_URL}/${id}/force-delete`);
    return response.data;
  } catch (error) {
    console.error("Error force deleting cafeteria item", error);
    throw error;
  }
}

// Add stock
export const addStock = async (stockData) => {
  try {
    const response = await API.post(`${BASE_URL}/add-stock`, stockData);
    return response.data;
  } catch (error) {
    console.error("Error adding stock", error);
    throw error;
  }
}

// Remove Stock
export const removeStock = async (stockData) => {
  try {
    const response = await API.post(`${BASE_URL}/remove-stock`, stockData);
    return response.data;
  } catch (error) {
    console.error("Error removing stock", error);
    throw error;
  }
}

// get stock history
export const getItemStockHistory = async ({ page = 1 }) => {
  try {
    const response = await API.get(`${BASE_URL}?page=${page}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching items stock history", error);
    throw error;
  }
};

// Cafeteria purchase
export const purchaseItem = async (formData) => {
  try {
    const response = await API.post(`${BASE_URL}/purchase`, formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error purchasing item", error);
    throw error;
  }
};

// Get cafeteria transactions
export const getCafeteriaTransactions = async ({ date, child_id }) => {
  try {
      const response = await API.get(`${BASE_URL}/purchases`, {
          params: {
              ...(date && { date }),
              ...(child_id && { child_id })
          }
      });
      return response.data;
  } catch (error) {
      console.error("Error fetching cafeteria transactions:", error);
      throw error;
  }
};