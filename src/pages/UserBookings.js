import React, { useEffect, useState } from "react";
import { getUserBookings } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination
} from "@mui/material";


const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchBookings();
    }, [page]);

    const fetchBookings = async () => {
        try {
            const response = await getUserBookings();
            setBookings(response.bookings?.data || []);
        } catch (err) {
            console.error("Failed to fetch user bookings.");
        }
    };

    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <h5>User Bookings</h5>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Parent</TableCell>
                            <TableCell>Child Name</TableCell>
                            <TableCell>Program Name</TableCell>
                            <TableCell>Skill Name</TableCell>
                            <TableCell>Duration (Months)</TableCell>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Amount Paid</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.user?.name || "N/A"}</TableCell>
                                <TableCell>{booking.child?.child_name || "N/A"}</TableCell>
                                <TableCell>{booking.program?.program_name || "N/A"}</TableCell>
                                <TableCell>{booking.skill_level?.skill_name || "N/A"}</TableCell>
                                <TableCell>{booking.payment_plan?.duration_months || "N/A"}</TableCell>
                                <TableCell>{booking.transaction?.transaction_id || "N/A"}</TableCell>
                                <TableCell>{booking.transaction?.amount_paid || "N/A"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    className="custom_pagination"
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={bookings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </>
    );
};

export default UserBookings;
