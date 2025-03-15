import React, { useEffect, useState } from "react";
import { getUserBookings } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography
} from "@mui/material";
import Spinner from "../includes/Spinner";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon, CurrencyRupee as CurrencyRupeeIcon, MoreVert as Menu } from "@mui/icons-material";

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [page]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await getUserBookings();
            setBookings(response.bookings?.data || []);
        } catch (err) {
            console.error("Failed to fetch user bookings.");
        }
        setLoading(false);
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

            {loading ? <Spinner loading={loading} /> : (
                bookings.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Child Name</TableCell>
                                    <TableCell>Program Name</TableCell>
                                    <TableCell>Skill Name</TableCell>
                                    <TableCell>Duration</TableCell>
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
                                        <TableCell>{booking.payment_plan?.duration_months || "N/A"} Months</TableCell>
                                        <TableCell><span className="px-3 py-1 rounded-1 bg-opacity-10 bg-success text-success">{booking.transaction?.transaction_id || "N/A"}</span></TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{booking.transaction?.amount_paid || "N/A"}</TableCell>
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
                ) : (
                    <Typography variant="body1" align="center">No Data Available</Typography>
                )
            )}
        </>
    );
};

export default UserBookings;
