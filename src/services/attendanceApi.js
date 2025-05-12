import API from "../config/api";

const BASE_URL = "/api";

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

        const response = await API.get(`${BASE_URL}/attendance/day-wise-records?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        throw error;
    }
};

export const getDeviceAttendanceRecords = async ({ fromDate = "", toDate = "" } = {}) => {
    try {
        const params = new URLSearchParams({ fromDate, toDate });
        const response = await API.get(`${BASE_URL}/device/attendance-records?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching device attendance records:", error);
        throw error;
    }
};