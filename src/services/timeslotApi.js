import API from "../config/api";

// Fetch timeslots based on program and skill level
export const getTimeSlots = async (programId, skillLevelId) => {
    try {
        const response = await API.get(`/api/time-slots?program_id=${programId}&skill_level_id=${skillLevelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching timeslots", error);
        throw error;
    }
};

// Fetch timeslots
export const getAllTimeSlots = async ({ page = 1, per_page = 10, search = "" }) => {
    try {
        const response = await API.get(`/api/time-slots?page=${page}&per_page=${per_page}&search=${search}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching timeslots", error);
        throw error;
    }
};

// Add a new timeslot
export const addTimeSlot = async (timeslotData) => {
    try {
        const response = await API.post("/api/time-slots", timeslotData);
        return response.data;
    } catch (error) {
        console.error("Error adding timeslot", error);
        throw error;
    }
};

// update an existing timeslot
export const updateTimeSlot = async (id, timeslotData) => {
    try {
        const response = await API.put(`/api/time-slots/${id}`, timeslotData);
        return response.data;
    } catch (error) {
        console.error("Error updating timeslot", error);
        throw error;
    }
};

// Delete a timeslot
export const deleteTimeSlot = async (id) => {
    try {
        const response = await API.delete(`/api/time-slots/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting timeslot", error);
        throw error;
    }
};