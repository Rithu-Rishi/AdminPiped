import React, { useEffect, useState } from "react";
import { getFacilityUserPayments } from "../services/facilityApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography, TextField, InputAdornment
} from "@mui/material";
import Spinner from "../includes/Spinner";
import { Search as SearchIcon, CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";
import useDebounce from "../hooks/useDebounce";
import NoData from "../includes/NoData";

const FacilityUserPayments = () => {
    const [payments, setPayments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchPayments();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await getFacilityUserPayments({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            setPayments(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error("Failed to fetch facility user payments.");
        }
        setLoading(false);
    };

    // const handleChangePage = (_, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

    return (
        <>
            <div className="d-flex justify-content-between mb-2">
                <h5>Facility User Payments</h5>
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
                payments.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell>Child Name</TableCell>
                                    <TableCell>Duration</TableCell>
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
                                        <TableCell>{payment.paymentplan?.duration_months || "N/A"} Months</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{payment.amount_paid}</TableCell>
                                        <TableCell><span className="px-3 py-1 rounded-1 bg-opacity-10 bg-success text-success">{payment.transaction_id}</span></TableCell>
                                        <TableCell>{payment.payment_date}</TableCell>
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
        </>
    );
};

export default FacilityUserPayments;
