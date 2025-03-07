import API from "../config/api.js";

// Fetch all skill progressions
export const getAllSkillProgressions = async (page = 1) => {
    try {
        const response = await API.get(`/api/skill-progressions?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching skill progressions:", error);
        throw error;
    }
};

// Add multiple skill progressions
export const addSkillProgressions = async (progressionData) => {
    try {
        const formData = new FormData();
        formData.append("program_id", progressionData.program_id);

        progressionData.titles.forEach((title, index) => {
            formData.append(`titles[${index}]`, title);
            formData.append(`descriptions[${index}]`, progressionData.descriptions[index]);
            formData.append(`images[${index}]`, progressionData.images[index]);
        });

        const response = await API.post("/api/skill-progressions", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding skill progressions:", error);
        throw error;
    }
};

// Update skill progression
export const updateSkillProgression = async (id, progressionData) => {
    try {
        const formData = new FormData();
        formData.append("program_id", progressionData.program_id);
        formData.append("title", progressionData.title);
        formData.append("description", progressionData.description);
        if (progressionData.image instanceof File) {
            formData.append("image", progressionData.image);
        }

        const response = await API.post(`/api/skill-progressions/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error editing skill progression:", error);
        throw error;
    }
};

// Delete a skill progression
export const deleteSkillProgression = async (id) => {
    try {
        const response = await API.delete(`/api/skill-progressions/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting skill progression:", error);
        throw error;
    }
};
