import API from "../config/api.js";

// Fetch all sub-programs
export const getAllSubPrograms = async (page = 1) => {
    try {
      const response = await API.get(`/api/sub-programs?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sub-programs:", error);
      throw error;
    }
  };
  
  // Add a new sub-program with multiple images
  export const addSubProgram = async (subProgramData) => {
    try {
      const formData = new FormData();
      formData.append("program_id", subProgramData.program_id);
      formData.append("sub_title", subProgramData.sub_title);
      formData.append("keywords", subProgramData.keywords);
  
      subProgramData.images.forEach((image, index) => {
        formData.append(`images[]`, image);
        formData.append(`image_titles[]`, subProgramData.image_titles[index]);
        formData.append(`image_colors[]`, subProgramData.image_colors[index]);
      });
  
      const response = await API.post("/api/sub-programs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding sub-program:", error);
      throw error;
    }
  };
  
  // Update an existing sub-program
  export const updateSubProgram = async (id, subProgramData) => {
    try {
      const formData = new FormData();
      formData.append("program_id", subProgramData.program_id);
      formData.append("sub_title", subProgramData.sub_title);
      formData.append("keywords", subProgramData.keywords);
  
      subProgramData.images.forEach((image, index) => {
        formData.append(`images[]`, image);
        formData.append(`image_titles[]`, subProgramData.image_titles[index]);
        formData.append(`image_colors[]`, subProgramData.image_colors[index]);
      });
  
      const response = await API.post(`/api/sub-programs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error editing sub-program:", error);
      throw error;
    }
  };
  
  // Delete a sub-program
  export const deleteSubProgram = async (id) => {
    try {
      const response = await API.delete(`/api/sub-programs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting sub-program:", error);
      throw error;
    }
  };
  