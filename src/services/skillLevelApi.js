import API from "../config/api.js";

// Fetch all skill levels
export const getAllSkillLevels = async ({ page = 1, per_page = 10, search = "" }) => {
  try {
    const response = await API.get(`/api/skill-levels?page=${page}&per_page=${per_page}&search=${search}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching skill levels:", error);
    throw error;
  }
};

// Add multiple skill levels
export const addSkillLevels = async (skillLevelsData) => {
  try {
    const response = await API.post("/api/skill-levels", skillLevelsData);
    return response.data;
  } catch (error) {
    console.error("Error adding skill levels:", error);
    throw error;
  }
};

// Update existing skill levels
export const updateSkillLevels = async (id, skillLevelsData) => {
  try {
    const response = await API.put(`/api/skill-levels/${id}`, skillLevelsData);
    return response.data;
  } catch (error) {
    console.error("Error updating skill levels:", error);
    throw error;
  }
};

// Delete a skill level
export const deleteSkillLevel = async (id) => {
  try {
    const response = await API.delete(`/api/skill-levels/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting skill level:", error);
    throw error;
  }
};

// Fetch skill levels Pprogram
export const getProgramSkillLevels = async (programId) => {
  try {
    const response = await API.get(`/api/programs/${programId}/skill-levels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skill levels:", error);
    throw error;
  }
};