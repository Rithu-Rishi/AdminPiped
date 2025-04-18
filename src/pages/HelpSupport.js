import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Typography, TablePagination, TextField, InputAdornment
} from "@mui/material";
import Spinner from "../includes/Spinner";
import { getHelpSupportQueries } from "../services/adminApi";
import useDebounce from "../hooks/useDebounce";
import { Search as SearchIcon } from "@mui/icons-material";
import { formatDate } from '../utils/dateUtils';
import NoData from "../includes/NoData";

const HelpSupport = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchQueries();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchQueries = async () => {
        setLoading(true);
        try {
            const response = await getHelpSupportQueries({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            setQueries(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            console.error("Failed to fetch help/support queries");
        }
        setLoading(false);
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Help & Support Queries</h5>
                <TextField className="search_icon"
                    size="small"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
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
                queries.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Message</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {queries.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.user?.name}</TableCell>
                                        <TableCell>{row.user?.email}</TableCell>
                                        <TableCell>{row.message}</TableCell>
                                        <TableCell>{formatDate(row.created_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={(event, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
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

export default HelpSupport;
