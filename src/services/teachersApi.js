import API from "../config/api.js";

// Fetch all teachers
export const getAllTeachers = async () => {
    try {
        const response = await API.get("/api/teachers");
        return response.data;
    } catch (error) {
        console.error("Error fetching teachers:", error);
        throw error;
    }
};

// Get a teacher
export const getTeacher = async (id) => {
    try {
        const response = await API.get(`/api/teachers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching teachers:", error);
        throw error;
    }
};

// Add a new teacher with image upload
export const addTeacher = async (teacherData) => {
    try {
        const formData = new FormData();
        for (const key in teacherData) {
            formData.append(key, teacherData[key]);
        }

        const response = await API.post("/api/teachers", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Error adding teacher:", error);
        throw error;
    }
};

// Update an existing teacher with image upload
export const updateTeacher = async (id, teacherData) => {
    try {
        const formData = new FormData();
        for (const key in teacherData) {
            formData.append(key, teacherData[key]);
        }

        const response = await API.post(`/api/teachers/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating teacher:", error);
        throw error;
    }
};

// Delete a teacher
export const deleteTeacher = async (id) => {
    try {
        const response = await API.delete(`/api/teachers/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting teacher:", error);
        throw error;
    }
};
