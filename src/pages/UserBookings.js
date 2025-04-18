import React, { useEffect, useState } from "react";
import { getUserBookings, getBookingDetails } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography, Modal, Box, TextField, InputAdornment
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import { CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";
import { Row, Col } from "react-bootstrap";
import useDebounce from "../hooks/useDebounce";
import NoData from "../includes/NoData";

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchBookings();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await getUserBookings({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            setBookings(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error("Failed to fetch user bookings.");
        }
        setLoading(false);
    };

    const handleBookingDetails = async (bookingId) => {
        setLoading(true);
        try {
            const response = await getBookingDetails(bookingId);
            console.log("response ", response);
            setBookingDetails(response);
            console.log("details ", bookingDetails);
            setDetailModalOpen(true);
        } catch (err) {
            console.error("Failed to fetch booking details.");
        }
        setLoading(false);
    };

    const handleClose = () => {
        setDetailModalOpen(false);
        setBookingDetails(null);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5 className="mb-0">User Bookings</h5>

                <TextField className="search_icon"
                    placeholder="Search..." size="small" value={searchTerm} onChange={(e) => {
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
                bookings.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Booking ID</TableCell>
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
                                        <TableCell onClick={() => handleBookingDetails(booking.booking_id)}><span className="px-2 py-1 rounded-1 bg-opacity-25 pe-auto bg-primary text-primary">{booking.booking_id || "N/A"}</span></TableCell>
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
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(parseInt(event.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </TableContainer>
                ) : (
                    <NoData />
                )
            )}

            <Modal open={detailModalOpen} onClose={handleClose}>
                <Box className="custom_modal" sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper',
                    boxShadow: 12, borderRadius: 2
                }}>
                    <Typography variant="h6" className="custom_heading_modal">Booking Details</Typography>
                    <Box className="modal_body bg-white p-3" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
                        {bookingDetails ? (
                            <>
                                <Row>
                                    <Col>
                                        <div className="section">
                                            <h6>Child Information</h6>
                                            <p><span>Name</span>: {bookingDetails.child?.child_name || "N/A"}</p>
                                            <p><span>Gender</span>: {bookingDetails.child?.gender || "N/A"}</p>
                                            <p><span>Code</span>: {bookingDetails.child?.code || "N/A"}</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="section">
                                            <h6>Parent Information</h6>
                                            <p><span>Name</span>: {bookingDetails.parent?.name || "N/A"}</p>
                                            <p><span>Email</span>: {bookingDetails.parent?.email || "N/A"}</p>
                                            <p><span>Mobile</span>: {bookingDetails.parent?.mobile_number || "N/A"}</p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="section">
                                            <h6>Program Details</h6>
                                            <p><span>Program</span>: {bookingDetails.program?.program_name || "N/A"}</p>
                                            <p><span>Skill Level</span>: {bookingDetails.skill_level?.skill_name || "N/A"} ({bookingDetails.payment_plan?.duration_months || "N/A"} months)</p>
                                            <p><span>Sub Program</span>: {bookingDetails.sub_program_focus?.title || "N/A"}</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="section">
                                            <h6>Payment Details</h6>
                                            <p><span>Payment Plan</span>: {bookingDetails.payment_plan?.duration_months || "N/A"} Months</p>
                                            <p><span>Transaction ID</span>: {bookingDetails.transaction?.transaction_id || "N/A"}</p>
                                            <p><span>Amount Paid</span>: <CurrencyRupeeIcon className="fs-14 text-black" />{bookingDetails.transaction?.amount_paid || "N/A"}</p>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="section">
                                    <h6>Time Slots</h6>
                                    {bookingDetails.time_slots?.length > 0 ? (
                                        bookingDetails.time_slots.map((slot, index) => (
                                            <p key={index}>
                                                <span>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][slot.day]}</span> :
                                                {slot.start_time} - {slot.end_time}
                                            </p>
                                        ))
                                    ) : (
                                        <p>N/A</p>
                                    )}
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