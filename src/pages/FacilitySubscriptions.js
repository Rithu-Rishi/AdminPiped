import React, { useEffect, useState } from "react";
import { getFacilityUserSubscriptions } from "../services/facilityApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
 TablePagination
} from "@mui/material";

const FacilitySubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchSubscriptions();
    }, [page]);

    const fetchSubscriptions = async () => {
        try {
            const response = await getFacilityUserSubscriptions();
            setSubscriptions(response || []);
        } catch (err) {
            console.error("Failed to fetch facility subscriptions.");
        }
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
            <h5>Facility Subscriptions</h5>
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
                                <TableCell>{subscription.start_date || "N/A"}</TableCell>
                                <TableCell>{subscription.end_date || "N/A"}</TableCell>
                                <TableCell>{subscription.status || "N/A"}</TableCell>
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
        </>
    );
};

export default FacilitySubscriptions;