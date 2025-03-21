import API from "../config/api.js";

// Fetch all programs
export const getAllPrograms = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/programs?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

// Fetch Programs for Drop down
export const getDropDownPrograms = async () => {
    try {
        const response = await API.get(`/api/programs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

// Get a program
export const getProgram = async (id) => {
    try {
        const response = await API.get(`/api/programs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};

// Add a new programs with image upload
export const addProgram = async (programData) => {
    try {
        const formData = new FormData();
        for (const key in programData) {
            formData.append(key, programData[key]);
        }

        const response = await API.post("/api/programs", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Error adding programs:", error);
        throw error;
    }
};

// Update an existing program with image upload
export const updateProgram = async (id, programData) => {
    try {
        const formData = new FormData();
        for (const key in programData) {
            formData.append(key, programData[key]);
        }

        const response = await API.post(`/api/programs/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating programs:", error);
        throw error;
    }
};

// Delete a program
export const deleteProgram = async (id) => {
    try {
        const response = await API.delete(`/api/programs/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting programs:", error);
        throw error;
    }
};