import React, { useEffect, useState } from "react";
import { getUserBookings, getBookingDetails } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography, Modal, Box
} from "@mui/material";
import Spinner from "../includes/Spinner";
import { CurrencyRupee as CurrencyRupeeIcon} from "@mui/icons-material";
import { Row, Col } from "react-bootstrap";

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

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

    const handleOpen = async (bookingId) => {
        setLoading(true);
        try {
            const response = await getBookingDetails(bookingId);
            setSelectedBooking(response);
            setOpen(true);
        } catch (err) {
            console.error("Failed to fetch booking details.");
        }
        setLoading(false);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBooking(null);
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
                                        <TableCell onClick={() => handleOpen(booking.id)}>{booking.child?.child_name || "N/A"}</TableCell>
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

            <Modal open={open} onClose={handleClose}>
                <Box className="custom_modal" sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper',
                    boxShadow: 12, borderRadius: 2
                }}>
                    <Typography variant="h6" className="custom_heading_modal">Booking Details</Typography>
                    <Box className="modal_body bg-white p-3" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
                        {selectedBooking ? (
                            <>
                                <Row>
                                    <Col>
                                        <div className="section">
                                            <h6>Child Information</h6>
                                            <p><span>Name</span>: {selectedBooking.child?.child_name || "N/A"}</p>
                                            <p><span>Gender</span>: {selectedBooking.child?.gender || "N/A"}</p>
                                            <p><span>Code</span>: {selectedBooking.child?.code || "N/A"}</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="section">
                                            <h6>Parent Information</h6>
                                            <p><span>Name</span>: {selectedBooking.user?.name || "N/A"}</p>
                                            <p><span>Email</span>: {selectedBooking.user?.email || "N/A"}</p>
                                            <p><span>Role</span>: {selectedBooking.user?.role || "N/A"}</p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="section">
                                            <h6>Program Details</h6>
                                            <p><span>Program</span>: {selectedBooking.program?.program_name || "N/A"}</p>
                                            <p><span>Skill Level</span>: {selectedBooking.skill_level?.skill_name || "N/A"} ({selectedBooking.payment_plan?.duration_months || "N/A"} months)</p>
                                            <p><span>Sub Program</span>: {selectedBooking.sub_program?.sub_program_name || "N/A"}</p>
                                            <p><span>Focus Area</span>: {selectedBooking.focus_area?.focus_area_name || "N/A"}</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="section">
                                            <h6>Payment Details</h6>
                                            <p><span>Final Amount</span>: <CurrencyRupeeIcon className="fs-14 text-black" />{selectedBooking.transaction?.final_amount || "N/A"}</p>
                                            <p><span>Payment Plan</span>: {selectedBooking.payment_plan?.duration_months || "N/A"} Months</p>
                                            <p><span>Transaction ID</span>: {selectedBooking.transaction?.transaction_id || "N/A"}</p>
                                            <p><span>Amount Paid</span>: <CurrencyRupeeIcon className="fs-14 text-black" />{selectedBooking.transaction?.amount_paid || "N/A"}</p>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="section">
                                    <h6>Time Slots</h6>
                                    {selectedBooking.time_slots?.map((slot, index) => (
                                        <p key={index}><span>{slot.day}</span>: {slot.start_time} - {slot.end_time}</p>
                                    )) || "N/A"}
                                </div>
                            </>
                        ) : (
                            <Typography variant="body1">Loading...</Typography>
                        )}
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UserBookings;