import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, FormControl,
    Paper, Typography, Box, Button
} from '@mui/material';
import { Search as SearchIcon, CalendarMonth as CalendarMonthIcon } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {  getDeviceAttendanceRecords } from '../services/attendanceApi';
import Spinner from '../includes/Spinner';
import dayjs from 'dayjs';
import NoData from "../includes/NoData";

const DeviceAttendance = () => {
    const [filters, setFilters] = useState({
        fromDate: null,
        toDate: null
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDeviceAttendance();
    }, []);

    const fetchDeviceAttendance = async () => {
        setLoading(true);
        try {
            const response = await getDeviceAttendanceRecords({
                fromDate: filters.fromDate ? dayjs(filters.fromDate).format('YYYY-MM-DD') : undefined,
                toDate: filters.toDate ? dayjs(filters.toDate).format('YYYY-MM-DD') : undefined
            });
            setAttendanceData(response.items || []);
        } catch (err) {
            console.error('Failed to fetch attendance data.');
        }
        setLoading(false);
    };

    return (
        <Box>
            <Typography variant="h5" className="mb-3">Device Attendance Records</Typography>

            <Box className="d-flex gap-2 justify-content-end mb-3">

                <div className="position-relative" style={{ maxWidth: "200px" }}>
                    <DatePicker
                        selected={filters.fromDate}
                        onChange={(date) => setFilters({ ...filters, fromDate: date })}
                        dateFormat="dd MMM, yyyy"
                        placeholderText="From Date" 
                        className="form-control"
                    />
                    <span
                        className="position-absolute"
                        style={{
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                        }}
                    >
                        <CalendarMonthIcon />
                    </span>
                </div>
                <div className="position-relative" style={{ maxWidth: "200px" }}>
                    <DatePicker
                        selected={filters.toDate}
                        onChange={(date) => setFilters({ ...filters, toDate: date })}
                        dateFormat="dd MMM, yyyy"
                        placeholderText="To Date"
                        className="form-control"
                    />
                    <span
                        className="position-absolute"
                        style={{
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                        }}
                    >
                        <CalendarMonthIcon />
                    </span>
                </div>
                <Button size="" variant="contained" onClick={fetchDeviceAttendance} startIcon={<SearchIcon />}>Search</Button>
            </Box>

            {loading ? <Spinner loading={loading} /> : (
                attendanceData.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>empNo</TableCell>
                                    <TableCell>Child</TableCell>
                                    <TableCell>Punch Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendanceData.map((data) => (
                                    <TableRow key={data.cpuid}>
                                        <TableCell>{data.empNo}</TableCell>
                                        <TableCell>{data.child.child_name}</TableCell>
                                        <TableCell>{data.strPunchTime}</TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <NoData />
                )
            )}
        </Box>
    );
}

export default DeviceAttendance;