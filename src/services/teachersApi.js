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

// Assign teachers to a program
export const assignTeachersToProgram = async (programId, teacherData) => {
    try {
        const response = await API.post(`/api/programs/${programId}/assign-teachers`, teacherData);
        return response.data;
    } catch (error) {
        console.error("Error assigning teachers to program", error);
        throw error;
    }
};

// Fetch teachers based on Program
export const getTeachersToProgram = async (programId) => {
    try {
        const response = await API.get(`/api/programs/${programId}/teachers`);
        return response.data;
    } catch (error) {
        console.error("Error assigning teachers to program", error);
        throw error;
    }
};

export const getProgramsWithTeachers = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/programs-with-teachers?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data;
    } catch (error) {
        console.error("Error assigning teachers to program", error);
        throw error;
    }
};

export const removeTeacherFromProgram = async (programId, teacherId) => {
    try {
        const response = await API.delete(`/api/programs/${programId}/remove-teacher/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error("Error assigning teachers to program", error);
        throw error;
    }
};