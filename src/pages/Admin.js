import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Modal, Box, Typography, TextField, TablePagination, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon,  MoreVert as Menu, } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import {
    getAllAdmins, addAdmin, updateAdmin, deleteAdmin
} from "../services/adminApi";
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import { formatDate } from '../utils/dateUtils';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import NoData from "../includes/NoData";

const Admin = () => {
    const [admins, setAdmins] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [editId, setEditId] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ open: false, type: '', message: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchAdmins();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await getAllAdmins({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            setAdmins(response.data);
            setTotalCount(response.total);
        } catch (err) {
            setAlertMessage({ open: true, type: 'error', message: 'Failed to fetch admins' });
        }
        setLoading(false);
    };

    const handleOpenForm = (admin = null) => {
        if (admin) {
            setFormData({ name: admin.name, email: admin.email });
            setEditId(admin.id);
        } else {
            setFormData({ name: '', email: '' });
            setEditId(null);
        }
        setFormModalOpen(true);
    };

    const handleSubmit = async () => {
        const { name, email } = formData;
        if (!name || !email) {
            setAlertMessage({ open: true, type: 'error', message: 'All fields are required.' });
            return;
        }
        setLoading(true);
        try {
            if (editId) {
                await updateAdmin(editId, formData);
                setAlertMessage({ open: true, type: 'success', message: 'Admin Updated Successfully!' });
            } else {
                await addAdmin(formData);
                setAlertMessage({ open: true, type: 'success', message: 'Admin Created Successfully!' });
            }
            setFormModalOpen(false);
            fetchAdmins();
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteAdmin(selectedAdmin.id);
            setDeleteModalOpen(false);
            fetchAdmins();
        } catch (err) {
            setAlertMessage({ open: true, type: 'error', message: 'Delete failed' });
        }
        setLoading(false);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5 className="mb-0">Admins</h5>
                <div className='d-flex align-items-center gap-2'>
                    <TextField className="search_icon"
                        size="small" placeholder="Search..." value={searchTerm} onChange={(e) => {
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
                    <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
                        Add Admin
                    </Button>
                </div>
            </div>

            {loading ? <Spinner loading={loading} /> : (
                admins.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin.id}>
                                        <TableCell>{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell>{formatDate(admin.created_at)}</TableCell>

                                        <TableCell align="center">
                                            <DropdownButton
                                                align="end"
                                                title={<Menu />}
                                                size='sm'
                                                className="custom_dropdown"
                                            >
                                                <Dropdown.Item size="small" className="fs-14" onClick={() => handleOpenForm(admin)}>Edit</Dropdown.Item>
                                                <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => { setSelectedAdmin(admin); setDeleteModalOpen(true); }}>Delete</Dropdown.Item>
                                            </DropdownButton>
                                        </TableCell>
                                        {/* <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleOpenForm(admin)}><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => { setSelectedAdmin(admin); setDeleteModalOpen(true); }}><DeleteIcon /></IconButton>
                                        </TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={(event, newPage) => setPage(newPage)}
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

            {/* Add/Edit Modal */}
            <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
                <Box className="custom_modal" sx={{ width: 400, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, mx: 'auto', mt: 10 }}>
                    <Typography variant="h6" gutterBottom>{editId ? 'Edit Admin' : 'Add Admin'}</Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField label="Name" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} size="small" fullWidth required />
                        <TextField label="Email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} size="small" fullWidth required />
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Delete Modal */}
            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <Box sx={{ width: 300, bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 24, mx: 'auto', mt: 10 }}>
                    <Typography variant="h6">Confirm Deletion</Typography>
                    <Typography>Are you sure you want to delete <b>{selectedAdmin?.name}</b>?</Typography>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                    </Box>
                </Box>
            </Modal>

            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default Admin;
