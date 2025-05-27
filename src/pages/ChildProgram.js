import React, { useEffect, useState } from "react";
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, TextField, FormControlLabel, Checkbox,
    TablePagination, InputAdornment, Chip, Grid
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { getParentGroupedDetails } from "../services/BookingsApi";
import dayjs from "dayjs";
import { formatDate } from '../utils/dateUtils';
import Spinner from "../includes/Spinner";
import useDebounce from "../hooks/useDebounce";

const ChildProgram = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeOnly, setActiveOnly] = useState(false);
    const [sortBy, setSortBy] = useState("end_date");
    const [sortOrder, setSortOrder] = useState("asc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchData();
    }, [debouncedSearch, activeOnly, sortBy, sortOrder, page, rowsPerPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(activeOnly && { active_only: true }),
                ...(sortBy && { sort_by: sortBy }),
                ...(sortOrder && { sort_order: sortOrder }),
                page: page + 1,
                per_page: rowsPerPage
            };
            const res = await getParentGroupedDetails(params);
            setData(res.data);
            setTotalCount(res.pagination.total || 0);
        } catch (err) {
            console.error("Error fetching parent grouped details", err);
        }
        setLoading(false);
    };

    const isExpired = (dateStr) => dayjs(dateStr).isBefore(dayjs());

    return (
        <>
            <div className='mb-2'>
                <h5 className="mb-0">Parent Children Subscriptions</h5>
            </div>
            <div className='d-flex gap-2 justify-content-end mb-3'>
                {/* <FormControlLabel
                    control={<Checkbox checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} />}
                    label="Active Only"
                /> */}
                <TextField className="search_icon" style={{ maxWidth: "480px" }}  
                    placeholder="Search Parent / Child / Program" size="small" value={searchTerm} onChange={(e) => {
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
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Parent Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Wallet</TableCell>
                                <TableCell>Children & Subscriptions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((parent, parentIdx) => (
                                <TableRow key={parentIdx}>
                                    <TableCell>{parent.parent_name}</TableCell>
                                    <TableCell>{parent.parent_phone}</TableCell>
                                    <TableCell>₹{parent.wallet_money}</TableCell>
                                    <TableCell>
                                        {parent.children.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary">No children</Typography>
                                        ) : (
                                            <Box display="flex" flexDirection="column" gap={2}>
                                                {parent.children.map((child, childIdx) => (
                                                    <Paper key={childIdx} variant="outlined" sx={{ p: 1 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{child.child_name}</Typography>
                                                        <Grid container spacing={1}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="body2" sx={{ mt: 1 }}>Facility Subscription:</Typography>
                                                                <Chip className="danger"
                                                                    label={child.facility_subscription_end_date ? formatDate(new Date(child.facility_subscription_end_date), 'dd MMM yyyy') : "Not Active"}
                                                                    color={isExpired(child.facility_subscription_end_date) || child.facility_subscription_end_date == null ? 'error' : 'success'}
                                                                    size="small"
                                                                    sx={{ mt: 0.5 }}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="body2" sx={{ mt: 1 }}>Programs:</Typography>
                                                                {child.programs.length === 0 ? (
                                                                    <Typography variant="body2" color="text.secondary">No programs</Typography>
                                                                ) : (
                                                                    <>{child.programs.map((program, progIdx) => (
                                                                        <Box key={progIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                                            <Typography variant="body2">
                                                                                {program.program_name}{program.sub_program_focus ? ` (${program.sub_program_focus})` : ''}
                                                                            </Typography>
                                                                            <Chip
                                                                                label={formatDate(new Date(program.program_subscription_end_date), 'dd MMM yyyy')}
                                                                                color={isExpired(program.program_subscription_end_date) ? 'error' : 'success'}
                                                                                size="small"
                                                                            />
                                                                        </Box>
                                                                    ))}</>)}
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        )}
                                    </TableCell>
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
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />
                </TableContainer>
            )}
        </>
    );
};

export default ChildProgram;