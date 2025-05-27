import React, { useEffect, useState } from "react";
import { getUserBookings, getBookingDetails, exportBookingHistoryCSV } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography, Modal, Box, TextField, InputAdornment, Button
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import { CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";
import { Row, Col } from "react-bootstrap";
import useDebounce from "../hooks/useDebounce";
import NoData from "../includes/NoData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';

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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, [page, rowsPerPage, debouncedSearch, startDate, endDate]);

    const fetchBookings = async () => {
        if (startDate && !endDate) { // If start date is set but end date is not
            return;
        }
        const filters = {
            page: page + 1,
            per_page: rowsPerPage,
            search: debouncedSearch,
        };

        if (startDate && endDate) {
            filters.start_date = dayjs(startDate).format('YYYY-MM-DD');
            filters.end_date = dayjs(endDate).format('YYYY-MM-DD');
        }

        setLoading(true);
        try {
            const response = await getUserBookings(filters);
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
            setBookingDetails(response);
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

    // Handle CSV Download
    const handleDownloadCSV = async () => {
        const filters = {
            search: debouncedSearch,
            start_date: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
            end_date: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null
        };
        try {
            const csvData = await exportBookingHistoryCSV(filters);
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const url = window.URL.createObjectURL(new Blob([csvData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `booking_history_${randomSuffix}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to export CSV");
        }
    }

    return (
        <>
            <div className='d-flex justify-content-between mb-2'>
                <h5 className="mb-0">User Bookings</h5>
                <div className="d-flex justify-content-end gap-2">
                    <div className="col-md-2">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            selectsStart startDate={startDate} maxDate={new Date()}
                            endDate={endDate} placeholderText="Start Date"
                            className="form-control" dateFormat="dd MMM, yyyy"
                        />
                    </div>
                    <div className="col-md-2">
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd startDate={startDate} endDate={endDate}
                            minDate={startDate} placeholderText="End Date" maxDate={new Date()}
                            className="form-control" dateFormat="dd MMM, yyyy"
                        />
                    </div>
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
                    <Button variant="outlined" size="small"
                        onClick={() => {
                            setStartDate(null); setEndDate(null); setSearchTerm(""); setPage(0);
                        }}
                    > Reset </Button>
                    <Button
                        variant="contained" color="success" size="small"
                        onClick={handleDownloadCSV}
                        startIcon={<DownloadIcon />}
                    >Export</Button>
                </div>


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
                                    {/* <TableCell>Amount Paid</TableCell> */}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking.id}>
                                        <TableCell role="button" onClick={() => handleBookingDetails(booking.booking_id)}><span className="px-2 py-1 rounded-1 bg-opacity-25 pe-auto bg-primary text-primary">{booking.booking_id || "N/A"}</span></TableCell>
                                        <TableCell>{booking.user?.name || "N/A"}</TableCell>
                                        <TableCell>{booking.child?.child_name || "N/A"}</TableCell>
                                        <TableCell>{booking.program?.program_name || "N/A"}</TableCell>
                                        <TableCell>{booking.skill_level?.skill_name || "N/A"}</TableCell>
                                        <TableCell>{booking.payment_plan?.duration_months || "N/A"} Months</TableCell>
                                        <TableCell><span className="px-3 py-1 rounded-1 bg-opacity-10 bg-success text-success">{booking.transaction?.transaction_id || "N/A"}</span></TableCell>
                                        {/* <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{booking.coupon?.coupon_code || "N/A"}</TableCell> */}
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
                                            <p><span>Payment Plan</span>: {bookingDetails.payment_plan?.duration_months || "N/A"} Months</p>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="section">
                                            <h6>Payment Details</h6>
                                            <p><span>Transaction ID</span>: {bookingDetails.transaction?.transaction_id || "N/A"}</p>
                                            <p>
                                                <span>Amount Paid</span>: <CurrencyRupeeIcon className="fs-14 text-black" />
                                                {(() => {
                                                    const amountPaid = parseFloat(bookingDetails.transaction?.amount_paid) || 0;
                                                    const coupon = bookingDetails.coupon;
                                                    let discountedAmount = amountPaid;

                                                    if (coupon) {
                                                        const couponValue = parseFloat(coupon.value) || 0;
                                                        if (coupon.coupon_type === "percent") {
                                                            discountedAmount = amountPaid - (amountPaid * couponValue / 100);
                                                        } else if (coupon.coupon_type === "amount") {
                                                            discountedAmount = amountPaid - couponValue;
                                                        }
                                                    }

                                                    return discountedAmount.toFixed(2);
                                                })()}
                                            </p>
                                            <p><span>Coupon Code</span>: {bookingDetails.coupon?.coupon_code || "N/A"}</p>
                                            <p>
                                                <span>Coupon Value</span>:
                                                {bookingDetails.coupon
                                                    ? bookingDetails.coupon.coupon_type === "percent"
                                                        ? `${bookingDetails.coupon.value}%`
                                                        : `₹${bookingDetails.coupon.value}`
                                                    : "N/A"}
                                            </p>
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