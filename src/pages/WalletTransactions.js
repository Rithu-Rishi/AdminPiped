import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Paper, TextField, MenuItem, Button
} from "@mui/material";
import { Search as SearchIcon, CalendarMonth as CalendarMonthIcon } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { getWalletTransactions } from "../services/walletApi";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";

const WalletTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState({
        user_id: "",
        transaction_type: "",
        start_date: new Date(),
        end_date: new Date()
    });
    const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

    useEffect(() => {
        fetchTransactions();
    }, [page, rowsPerPage]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {
                page: page + 1,
                per_page: rowsPerPage,
                ...filters,
                start_date: dayjs(filters.start_date).format("YYYY-MM-DD"),
                end_date: dayjs(filters.end_date).format("YYYY-MM-DD")
            };
            const res = await getWalletTransactions(params);
            setTransactions(res.data || []);
            setTotalCount(res.total || 0);
        } catch (error) {
            setAlertMessage({ open: true, type: "error", message: "Failed to fetch wallet transactions" });
        }
        setLoading(false);
    };

    const handleFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleSearch = () => {
        setPage(0);
        fetchTransactions();
    };

    return (
        <>
            <div className='mb-2'>
                <h5 className="mb-0">Wallet Transactions</h5>
            </div>

            <div className='d-flex gap-2 align-items-center mb-3'>
                <TextField
                style={{ maxWidth: "180px" }}
                    size="small" label="User ID" value={filters.user_id}
                    onChange={(e) => handleFilterChange("user_id", e.target.value)}
                />
                <TextField
                    select
                    size="small" label="Type" style={{ minWidth: 100 }}
                    value={filters.transaction_type}
                    onChange={(e) => handleFilterChange("transaction_type", e.target.value)}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                    <MenuItem value="debit">Debit</MenuItem>
                </TextField>
                <div className="position-relative" style={{ maxWidth: "160px" }}>
                    <DatePicker
                        selected={filters.start_date}
                        onChange={(date) => handleFilterChange("start_date", date)}
                        className="form-control form-control-lg fs-16 rounded-1"
                        dateFormat="yyyy-MM-dd"
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
                <div className="position-relative" style={{ maxWidth: "160px" }}>
                    <DatePicker
                        selected={filters.end_date}
                        onChange={(date) => handleFilterChange("end_date", date)}
                        className="form-control form-control-lg fs-16 rounded-1"
                        dateFormat="yyyy-MM-dd"
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
                <Button size="" variant="contained" onClick={handleSearch} startIcon={<SearchIcon />}>Search</Button>
            </div>

            {loading ? <Spinner loading={loading} /> : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((txn, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{dayjs(txn.date).format("DD MMM YYYY, hh:mm A")}</TableCell>
                                    <TableCell>{txn.transaction_type}</TableCell>
                                    <TableCell className={txn.transaction_type === 'credit' ? 'text-success' : 'text-danger'}>
                                        ₹ {txn.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{txn.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        className="custom_pagination"
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                    />
                </TableContainer>
            )}

            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default WalletTransactions;
