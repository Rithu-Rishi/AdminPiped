import React, { useEffect, useState } from "react";
import { getProgramTransactions } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography
} from "@mui/material";
import Spinner from "../includes/Spinner";

const Transitions = () => {
    const [transactions, setTransitions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTransitions();
    }, [page]);

    const fetchTransitions = async () => {
        setLoading(true);
        try {
            const response = await getProgramTransactions();
            console.log("data ", response);
            setTransitions(response.transactions || []);
        } catch (err) {
            console.error("Failed to fetch transactions");
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
            <h5>Program Transactions</h5>

            {loading ? <Spinner loading={loading} /> : (
                transactions.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Ampunt Paid</TableCell>
                                    <TableCell>Transaction ID</TableCell>
                                    <TableCell>Payment Status</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.parent?.name || "N/A"}</TableCell>
                                        <TableCell>{transaction.amount_paid || "N/A"}</TableCell>
                                        <TableCell>{transaction.transaction_id || "N/A"}</TableCell>
                                        <TableCell>{transaction.payment_status || "N/A"}</TableCell>
                                        <TableCell>{transaction.created_at || "N/A"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={transactions.length}
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

export default Transitions;