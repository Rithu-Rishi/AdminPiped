import React, { useEffect, useState } from "react";
import { getProgramSubscriptions } from "../services/BookingsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography
} from "@mui/material";
import Spinner from "../includes/Spinner";
import { formatDate } from '../utils/dateUtils';

const ProgramSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProgramSubscriptions();
    }, [page]);

    const fetchProgramSubscriptions = async () => {
        setLoading(true);
        try {
            const response = await getProgramSubscriptions();
            console.log(response.subscriptions.data);
            setSubscriptions(response.subscriptions.data || []);
        } catch (err) {
            console.error("Failed to fetch facility subscriptions.");
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
            <h5>Program Subscriptions</h5>

            {loading ? <Spinner loading={loading} /> : (
                subscriptions.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Child Name</TableCell>
                                    <TableCell>Program</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {subscriptions.map((subscription) => (
                                    <TableRow key={subscription.id}>
                                        <TableCell>{subscription.parent?.name || "N/A"}</TableCell>
                                        <TableCell>{subscription.parent?.mobile_number || "N/A"}</TableCell>
                                        <TableCell>{subscription.child?.child_name || "N/A"}</TableCell>
                                        <TableCell>{subscription.program?.program_name}</TableCell>
                                        <TableCell>{formatDate(subscription.start_date) || "N/A"}</TableCell>
                                        <TableCell>{formatDate(subscription.end_date) || "N/A"}</TableCell>
                                        <TableCell>
                                            <span className={`px-3 py-1 rounded-1 bg-opacity-10 ${subscription.status === 'active' ? 'bg-success text-success' : 'bg-danger text-dangr'}`}>
                                                {subscription.status || "N/A"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={subscriptions.length}
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

export default ProgramSubscriptions;