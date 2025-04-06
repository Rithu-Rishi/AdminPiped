import API from "../config/api";

// GET all feedbacks with filters
export const getTeacherFeedbacks = async (filters = {}) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await API.get(`/api/admin/get-feedbacks?${query}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching teacher feedbacks", error);
        throw error;
    }
};

// APPROVE feedback
export const approveFeedback = async (id) => {
    try {
        const response = await API.post(`/api/admin/child/approve-feedback/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error approving feedback", error);
        throw error;
    }
};

// REJECT feedback
export const rejectFeedback = async (id) => {
    try {
        const response = await API.post(`/api/admin/child/reject-feedback/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error rejecting feedback", error);
        throw error;
    }
};

// UPDATE feedback
export const updateFeedback = async (data) => {
    try {
        const response = await API.post(`/api/admin/child/update-feedback/${data.id}`, {
            ...data
        });
        return response.data;
    } catch (error) {
        console.error("Error updating feedback", error);
        throw error;
    }
};
