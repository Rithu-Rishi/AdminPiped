import React, { useEffect, useState } from "react";
import { getFacilityUserSubscriptions } from "../services/facilityApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TablePagination, Typography, TextField, InputAdornment
} from "@mui/material";
import Spinner from "../includes/Spinner";
import { formatDate } from '../utils/dateUtils';
import useDebounce from "../hooks/useDebounce";
import { Search as SearchIcon } from "@mui/icons-material";

const FacilitySubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchSubscriptions();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const response = await getFacilityUserSubscriptions({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            setSubscriptions(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error("Failed to fetch facility subscriptions.");
        }
        setLoading(false);
    };

    return (
        <>
            <div className="d-flex justify-content-between mb-2">
                <h5 className="mb-0">Facility Subscriptions</h5>
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
                subscriptions.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Parent</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Child Name</TableCell>
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

export default FacilitySubscriptions;