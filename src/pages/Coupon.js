import React, { useEffect, useState, useCallback } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, InputLabel, FormControl,
    Button, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, MoreVert as Menu } from "@mui/icons-material";
import { getAllCoupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } from "../services/couponApi";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import { formatDate } from '../utils/dateUtils';
import NoData from "../includes/NoData";

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        coupon_for: "", coupon_code: "", coupon_type: "", value: "",
        valid_from: new Date(), valid_to: new Date(), usage_limit: ""
    });
    const [editId, setEditId] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const fetchCoupons = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllCoupons({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            setCoupons(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
        setLoading(false);
    }, [page, rowsPerPage, debouncedSearch]);

    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    // Date Issue
    const formatLocalDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async () => {
        const { coupon_for, coupon_code, coupon_type, value, valid_from, valid_to, usage_limit } = formData;
        if (!coupon_for || !coupon_code || !coupon_type || !value || !valid_from || !valid_to || !usage_limit) {
            setAlertMessage({ open: true, type: "error", message: "All fields are required." });
            return;
        }

        if (new Date(valid_to) < new Date(valid_from)) {
            setAlertMessage({ open: true, type: "error", message: "Valid To date cannot be earlier than Valid From." });
            return;
        }

        const formattedData = {
            ...formData,
            valid_from: formatLocalDate(new Date(formData.valid_from)),
            valid_to: formatLocalDate(new Date(formData.valid_to))
        };

        setLoading(true);
        try {
            if (editId) {
                await updateCoupon(editId, formattedData);
                setAlertMessage({ open: true, type: "success", message: "Coupon updated successfully!" });
            } else {
                await addCoupon(formattedData);
                setAlertMessage({ open: true, type: "success", message: "Coupon updated successfully!" });
            }
            setFormModalOpen(false);
            fetchCoupons();
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
        setLoading(false);
    };

    const openFormModal = (coupon = null) => {
        if (coupon) {
            setFormData({ ...coupon, valid_from: new Date(coupon.valid_from), valid_to: new Date(coupon.valid_to) });
            setEditId(coupon.id);
        } else {
            setFormData({ coupon_for: "", coupon_code: "", coupon_type: "", value: "", valid_from: new Date(), valid_to: new Date(), usage_limit: "" });
            setEditId(null);
        }
        setFormModalOpen(true);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteCoupon(selectedRow.id);
            setAlertMessage({ open: true, type: "success", message: "Coupon deleted successfully!" });
            setDeleteModalOpen(false);
            fetchCoupons();
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
        setLoading(false);
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleCouponStatus(id);
            setAlertMessage({ open: true, type: "success", message: "Status updated successfully!", });
            fetchCoupons();
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5 className="mb-0">Coupons</h5>

                <div className='d-flex align-items-center gap-2'>
                    <TextField className="search_icon"
                        size="small" placeholder="Search..." value={searchTerm}
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
                    <Button size='small' variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>Create Coupon</Button>
                </div>

            </div>

            {loading ? <Spinner loading={loading} /> : (
                coupons.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Coupon Code</TableCell>
                                    <TableCell>For</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Value</TableCell>
                                    <TableCell>Valid From</TableCell>
                                    <TableCell>Valid To</TableCell>
                                    <TableCell>Usage Limit</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coupons.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.coupon_code}</TableCell>
                                        <TableCell>{row.coupon_for}</TableCell>
                                        <TableCell>{row.coupon_type}</TableCell>
                                        <TableCell>{row.value}</TableCell>
                                        <TableCell>{formatDate(row.valid_from)}</TableCell>
                                        <TableCell>{formatDate(row.valid_to)}</TableCell>
                                        <TableCell>{row.usage_limit}</TableCell>
                                        <TableCell>
                                            <Switch checked={row.is_active === 1} onChange={() => handleToggleStatus(row.id)} />
                                        </TableCell>
                                        <TableCell>
                                            <DropdownButton align="end" title={<Menu />} size='sm' className="custom_dropdown">
                                                <Dropdown.Item onClick={() => openFormModal(row)}>Edit</Dropdown.Item>
                                                <Dropdown.Item className="text-danger" onClick={() => { setSelectedRow(row); setDeleteModalOpen(true); }}>Delete</Dropdown.Item>
                                            </DropdownButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            component="div"
                            count={totalCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                        />
                    </TableContainer>
                ) : (
                    <NoData />
                )
            )}

            {/* Delete Modal */}
            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <Box sx={{
                    p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center"
                }}>
                    <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>Are you sure you want to delete <b>{selectedRow?.coupon_code}</b>?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Add/Edit Modal */}
            <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
                <Box className="custom_modal" sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
                    boxShadow: 12, borderRadius: 2
                }}>
                    <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? "Edit Coupon" : "Create Coupon"}</Typography>
                    <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="label-helper">Select Coupon For</InputLabel>
                            <Select size="small" name="coupon_for" fullWidth labelId="label-helper" label="Select Coupon For" value={formData.coupon_for} onChange={handleChange}>
                                <MenuItem value="Facility">Facility</MenuItem>
                                <MenuItem value="Program">Program</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField name="coupon_code" label="Coupon Code" size="small" value={formData.coupon_code} onChange={handleChange} fullWidth required />
                        <FormControl size="small" fullWidth>
                            <InputLabel id="label-helper">Select Coupon Type</InputLabel>
                            <Select name="coupon_type" size="small" fullWidth labelId="label-helper" label="Select Coupon Type" value={formData.coupon_type} onChange={handleChange}>
                                <MenuItem value="percent">Percent</MenuItem>
                                <MenuItem value="amount">Amount</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField name="value" label="Value" size="small" value={formData.value} onChange={handleChange} fullWidth required />
                        <DatePicker
                            selected={formData.valid_from}
                            onChange={(date) => setFormData({ ...formData, valid_from: date })}
                            dateFormat="dd MMM, yyyy"
                            placeholderText="Valid From"
                            className="form-control"
                        />
                        <DatePicker
                            selected={formData.valid_to}
                            onChange={(date) => setFormData({ ...formData, valid_to: date })}
                            dateFormat="dd MMM, yyyy"
                            placeholderText="Valid To"
                            className="form-control"
                            minDate={formData.valid_from}
                        />
                        <TextField name="usage_limit" label="Usage Limit" size="small" value={formData.usage_limit} onChange={handleChange} fullWidth />
                    </Box>
                    <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                        <Button onClick={() => setFormModalOpen(false)}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
                    </Box>
                </Box>
            </Modal>

            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default Coupons;