import API from "../config/api";

// Fetch Dashboard Data
export const getDashboardData = async () => {
  try {
    const response = await API.get("/api/dashboard/super-admin");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};