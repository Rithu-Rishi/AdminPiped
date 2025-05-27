import React, { useEffect, useState } from "react";
import { getProgramTransactions, exportProgramTransactionCSV } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, TextField, InputAdornment, Button
} from "@mui/material";
import { CurrencyRupee as CurrencyRupeeIcon, Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import { formatDate } from '../utils/dateUtils';
import useDebounce from "../hooks/useDebounce";
import NoData from "../includes/NoData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';

const Transitions = () => {
    const [transactions, setTransitions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        fetchTransitions();
    }, [page, rowsPerPage, debouncedSearch, startDate, endDate]);

    const fetchTransitions = async () => {
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
            const response = await getProgramTransactions(filters);
            setTransitions(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error("Failed to fetch transactions");
        }
        setLoading(false);
    };

    // Handle CSV Download
    const handleDownloadCSV = async () => {
        const filters = {
            search: debouncedSearch,
            start_date: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
            end_date: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null
        };
        try {
            const csvData = await exportProgramTransactionCSV(filters);
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            const url = window.URL.createObjectURL(new Blob([csvData]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `program_transactions_${randomSuffix}.csv`);
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
                <h5 className="mb-0">Program Transactions</h5>
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
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={handleDownloadCSV}
                        startIcon={<DownloadIcon />}
                    >
                        Export
                    </Button>
                </div>
            </div>

            {loading ? <Spinner loading={loading} /> : (
                transactions.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Amount Paid</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Transaction ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.parent?.name || "N/A"}</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{transaction.final_amount.toFixed(2) || "N/A"}</TableCell>
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
                    <NoData />
                )
            )}
        </>
    );
};

export default Transitions;