import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, TablePagination, InputAdornment, Typography
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import NoData from "../includes/NoData";
import useDebounce from "../hooks/useDebounce";
import { getTeacherSchedules } from "../services/teachersApi";

const TeacherSchedule = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchSchedules();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchSchedules = async () => {
        setLoading(true);
        try {
            const response = await getTeacherSchedules({
                page: page + 1,
                perpage: rowsPerPage,
                search: debouncedSearch,
            });
            setTeachers(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error("Failed to fetch teacher schedules.");
        }
        setLoading(false);
    };

    // const renderSchedules = () => {
    //     const rows = [];
    //     teachers.forEach((teacher) => {
    //         teacher.assigned_classes.forEach((cls, clsIdx) => {
    //             cls.time_ranges.forEach((slot, slotIdx) => {
    //                 rows.push({
    //                     teacher_name: teacher.name,
    //                     program_name: cls.program_name,
    //                     skill_level_name: cls.skill_level_name,
    //                     focus_name: cls.focus_name || "-",
    //                     days: cls.week_days.map(d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", "),
    //                     time: `${slot.start_time} - ${slot.end_time}`,
    //                     available_slots: slot.available_slots,
    //                     booked_slots: slot.booked_slots,
    //                 });
    //             });
    //         });
    //     });
    //     return rows;
    // };

    // const flattenedRows = renderSchedules();

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography variant="h6" className="mb-0">Teacher Schedules</Typography>
                <TextField
                    className="search_icon"
                    size="small"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className="fs-14 text-primary" />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            {loading ? <Spinner loading={loading} /> : (
                teachers.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Teacher</TableCell>
                                    <TableCell>Program</TableCell>
                                    <TableCell>Skill Level</TableCell>
                                    <TableCell>Focus</TableCell>
                                    <TableCell>Days</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Booked Slots</TableCell>
                                    <TableCell>Available Slots</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {teachers.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.teacher_name}</TableCell>
                                        <TableCell>{row.program_name}</TableCell>
                                        <TableCell>{row.skill_level_name}</TableCell>
                                        <TableCell>{row.focus_name || `-`}</TableCell>
                                        <TableCell>{row.week_days.toString()}</TableCell>
                                        <TableCell>{row.time_slot?.start_time} - {row.time_slot?.end_time}</TableCell>
                                        <TableCell>{row.time_slot?.booked_slots}</TableCell>
                                        <TableCell>{row.time_slot?.available_slots}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        />
                    </TableContainer>
                ) : <NoData />
            )}
        </>
    );
};

export default TeacherSchedule;