import React, { useEffect, useState } from "react";
import { getProgramTransactions } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography, TextField, InputAdornment
} from "@mui/material";
import { CurrencyRupee as CurrencyRupeeIcon, Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import { formatDate } from '../utils/dateUtils';
import useDebounce from "../hooks/useDebounce";

const Transitions = () => {
    const [transactions, setTransitions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchTransitions();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchTransitions = async () => {
        setLoading(true);
        try {
            const response = await getProgramTransactions({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            console.log("data ", response);
            setTransitions(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error("Failed to fetch transactions");
        }
        setLoading(false);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5 className="mb-0">Program Transactions</h5>

                <TextField
                    placeholder="Search..." size="small" value={searchTerm} onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            {loading ? <Spinner loading={loading} /> : (
                transactions.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Ampunt Paid</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Transaction ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.parent?.name || "N/A"}</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{transaction.amount_paid || "N/A"}</TableCell>
                                        <TableCell><span className="text-success">{transaction.payment_status || "N/A"}</span></TableCell>
                                        <TableCell>{formatDate(transaction.created_at) || "N/A"}</TableCell>
                                        <TableCell><span className="px-3 py-1 rounded-1 bg-opacity-10 bg-success text-success">{transaction.transaction_id || "N/A"}</span></TableCell>
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
                    <Typography variant="body1" align="center">No Data Available</Typography>
                )
            )}
        </>
    );
};

export default Transitions;