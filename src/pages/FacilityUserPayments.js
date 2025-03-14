import React, { useEffect, useState } from "react";
import { getFacilityUserPayments } from "../services/facilityApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography
} from "@mui/material";
import Spinner from "../includes/Spinner";

const FacilityUserPayments = () => {
    const [payments, setPayments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, [page]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await getFacilityUserPayments();
            setPayments(response || []);
        } catch (err) {
            console.error("Failed to fetch facility user payments.");
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
            <h5>Facility User Payments</h5>

            {loading ? <Spinner loading={loading} /> : (
                payments.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell>Child Name</TableCell>
                                    <TableCell>Duration (Months)</TableCell>
                                    <TableCell>Amount Paid</TableCell>
                                    <TableCell>Transaction ID</TableCell>
                                    <TableCell>Payment Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>{payment.parent?.name || "N/A"}</TableCell>
                                        <TableCell>{payment.parent?.mobile_number || "N/A"}</TableCell>
                                        <TableCell>{payment.child?.child_name || "N/A"}</TableCell>
                                        <TableCell>{payment.paymentplan?.duration_months || "N/A"}</TableCell>
                                        <TableCell>{payment.amount_paid}</TableCell>
                                        <TableCell>{payment.transaction_id}</TableCell>
                                        <TableCell>{payment.payment_date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={payments.length}
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

export default FacilityUserPayments;
