import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, FormControl,
    Paper, Typography, Box, TextField, Button, MenuItem, TablePagination, InputLabel
} from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAttendanceRecords } from '../services/attendanceApi';
import { getDropDownPrograms } from '../services/programsApi';
import { getDropDownAllTeachers } from '../services/teachersApi';
import Spinner from '../includes/Spinner';
import AlertMessage from '../includes/AlertMessage';
import useDebounce from '../hooks/useDebounce';
import dayjs from 'dayjs';

const Attendance = () => {
    const [filters, setFilters] = useState({
        program_id: '',
        focus_id: '',
        teacher_id: '',
        child_id: '',
        from_date: null,
        to_date: null,
        per_page: 10,
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const debouncedFilters = useDebounce(filters, 500);

    useEffect(() => {
        fetchPrograms();
        fetchTeachers();
    }, []);

    useEffect(() => {
        fetchAttendance();
    }, [page, rowsPerPage, debouncedFilters]);

    const fetchPrograms = async () => {
        try {
            const res = await getDropDownPrograms();
            setPrograms(res.data || []);
        } catch (error) {
            console.error('Failed to fetch programs');
        }
    };

    const fetchTeachers = async () => {
        try {
            const res = await getDropDownAllTeachers();
            setTeachers(res.data || []);
        } catch (error) {
            console.error('Failed to fetch teachers');
        }
    };

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const response = await getAttendanceRecords({
                ...filters,
                from_date: filters.from_date ? dayjs(filters.from_date).format('YYYY-MM-DD') : undefined,
                to_date: filters.to_date ? dayjs(filters.to_date).format('YYYY-MM-DD') : undefined,
                page: page + 1,
                per_page: rowsPerPage
            });
            console.log("attendance ", response);
            setAttendanceData(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error('Failed to fetch attendance data.');
        }
        setLoading(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Typography variant="h5" className="mb-3">Attendance Records</Typography>

            <Box className="d-flex gap-3 flex-wrap mb-3">
                <FormControl size="small" style={{ minWidth: 200 }}>
                    <InputLabel>Select Program</InputLabel>
                    <Select
                        size="small"
                        value={filters.program_id}
                        label="Select Program"
                        onChange={(e) => setFilters({ ...filters, program_id: e.target.value })}
                    >
                        <MenuItem value="">All Programs</MenuItem>
                        {programs.map((program) => (
                            <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" style={{ minWidth: 200 }}>
                    <InputLabel>Select Teacher</InputLabel>
                    <Select
                        size="small"
                        value={filters.teacher_id}
                        label="Select Teacher"
                        onChange={(e) => setFilters({ ...filters, teacher_id: e.target.value })}
                    >
                        <MenuItem value="">All Teachers</MenuItem>
                        {teachers.map((teacher) => (
                            <MenuItem key={teacher.id} value={teacher.id}>{teacher.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* <TextField
                    size="small"
                    label="Child ID"
                    value={filters.child_id}
                    onChange={(e) => setFilters({ ...filters, child_id: e.target.value })}
                /> */}

                <DatePicker
                    selected={filters.from_date}
                    onChange={(date) => setFilters({ ...filters, from_date: date })}
                    dateFormat="dd MMM, yyyy"
                    placeholderText="From Date"
                    className="form-control"
                />

                <DatePicker
                    selected={filters.to_date}
                    onChange={(date) => setFilters({ ...filters, to_date: date })}
                    dateFormat="dd MMM, yyyy"
                    placeholderText="To Date"
                    className="form-control"
                />
            </Box>

            {loading ? <Spinner loading={loading} /> : (
                attendanceData.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Child</TableCell>
                                    <TableCell>Program</TableCell>
                                    <TableCell>Focus</TableCell>
                                    <TableCell>Skill</TableCell>
                                    <TableCell>Teacher</TableCell>
                                    <TableCell>Time Slot</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceData.map((group) => (
                                    <React.Fragment key={group.date}>
                                        <TableRow>
                                            <TableCell colSpan={8} style={{ backgroundColor: '#f1f1f1', fontWeight: 'bold' }}>
                                                {dayjs(group.date).format('DD MMM, YYYY')}
                                            </TableCell>
                                        </TableRow>
                                        {group.records.map((rec, idx) => (
                                            <TableRow key={`${group.date}-${idx}`}>
                                                <TableCell></TableCell>
                                                <TableCell>{rec.child_name}</TableCell>
                                                <TableCell>{rec.program_name}</TableCell>
                                                <TableCell>{rec.focus_name}</TableCell>
                                                <TableCell>{rec.skill_level}</TableCell>
                                                <TableCell>{rec.teacher_name}</TableCell>
                                                <TableCell>{rec.start_time} - {rec.end_time}</TableCell>
                                                <TableCell className={rec.status === 'present' ? 'text-success' : 'text-danger'}>
                                                    {rec.status.toUpperCase()}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                ) : (
                    <Typography variant="body1" align="center">No Data Available</Typography>
                )
            )}
        </Box>
    );
}

export default Attendance;