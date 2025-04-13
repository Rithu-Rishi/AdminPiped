import API from "../config/api";

const BASE_URL = "/api/attendance/day-wise-records";

// Fetch Attendance Records with optional filters
export const getAttendanceRecords = async ({
    program_id = "", focus_id = "", teacher_id = "",
    child_id = "", from_date = "", to_date = "",
    page = 1, per_page = 10,
} = {}) => {
    try {
        const params = new URLSearchParams({
            program_id, focus_id, teacher_id, child_id,
            from_date, to_date, page, per_page,
        });

        const response = await API.get(`${BASE_URL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        throw error;
    }
};