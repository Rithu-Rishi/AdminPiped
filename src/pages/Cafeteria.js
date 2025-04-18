import React, { useEffect, useState } from "react";
import {
    getAllCafeteriaItems, addCafeteriaItem, updateCafeteriaItem, deleteCafeteriaItem,
    forceDeleteCafeteriaItem, restoreCafeteriaItem, addStock, removeStock
} from "../services/cafeteriaApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Modal, Box, Typography, TextField, TablePagination, InputAdornment, Switch
} from "@mui/material";
import { Add as AddIcon, MoreVert as Menu, Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import AlertMessage from "../includes/AlertMessage";
import { IMAGE_BASE_URL } from "../config/constants";
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import NoData from "../includes/NoData";

const Cafeteria = () => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({ name: "", description: "", price: "", stock: "", image: null });
    const [editId, setEditId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [stockForm, setStockForm] = useState({ quantity: '', reason: '' });
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

    useEffect(() => {
        fetchItems();
    }, [page, rowsPerPage, debouncedSearch]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await getAllCafeteriaItems({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            setItems(response.data || []);
            setTotalItems(response.total || 0);
        } catch (error) {
            handleApiError(error, setAlertMessage);
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        const { name, description, price, stock } = formData;
        if (!name || !description || !price || !stock) {
            setAlertMessage({ open: true, type: "error", message: "All fields are required." });
            return;
        }

        setLoading(true);
        try {
            if (editId) {
                await updateCafeteriaItem(editId, formData);
                setAlertMessage({ open: true, type: "success", message: "Item updated successfully." });
            } else {
                await addCafeteriaItem(formData);
                setAlertMessage({ open: true, type: "success", message: "Item created successfully." });
            }
            setFormModalOpen(false);
            fetchItems();
        } catch (error) {
            handleApiError(error, setAlertMessage);
        }
        setLoading(false);
    };

    const openFormModal = (item = null) => {
        if (item) {
            setFormData({ ...item });
            setPreviewImage(item.image ? `${IMAGE_BASE_URL}${item.image}` : null);
            setEditId(item.id);
        } else {
            setFormData({ name: "", description: "", price: "", stock: "", image: null });
            setPreviewImage(null);
            setEditId(null);
        }
        setFormModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleToggle = async (item) => {
        try {
            if (item.deleted_at) {
                await restoreCafeteriaItem(item.id);
                setAlertMessage({ open: true, type: "success", message: "Status updated successfully." });
            } else {
                await deleteCafeteriaItem(item.id);
                setAlertMessage({ open: true, type: "success", message: "Status updated successfully." });
            }
            fetchItems();
        } catch (error) {
            handleApiError(error, setAlertMessage);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await forceDeleteCafeteriaItem(selectedItem.id);
            setAlertMessage({ open: true, type: "success", message: "Item deleted successfully." });
            fetchItems();
        } catch (error) {
            handleApiError(error, setAlertMessage);
        }
        setDeleteModalOpen(false);
        setLoading(false);
    };

    const handleStockSubmit = async (type) => {
        const { quantity, reason } = stockForm;
        if (!quantity || !reason) {
            setAlertMessage({ open: true, type: 'error', message: 'Both quantity and reason are required.' });
            return;
        }
        setLoading(true);
        try {
            const payload = {
                cafeteria_item_id: selectedItem.id,
                quantity,
                reason
            };
            if (type === 'add') {
                await addStock(payload);
            } else {
                await removeStock(payload);
            }
            setStockModalOpen(false);
            fetchItems();
        } catch (err) {
            setAlertMessage({ open: true, type: 'error', message: 'Stock update failed.' });
        }
        setLoading(false);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5 className="mb-0">Cafeteria</h5>
                <div className="d-flex gap-2">
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
                    <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
                        Create Item
                    </Button>
                </div>
            </div>

            {loading ? <Spinner loading={loading} /> : (
                items.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {item.image && <img src={`${IMAGE_BASE_URL}${item.image}`} alt={item.name} width="30" height="30" className="border border-2 rounded-1" />}
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>{item.stock}</TableCell>
                                        <TableCell>
                                            <Switch checked={!item.deleted_at} onChange={() => handleToggle(item)} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <DropdownButton
                                                align="end"
                                                title={<Menu />}
                                                size='sm'
                                                className="custom_dropdown"
                                            >
                                                <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(item)}>Edit</Dropdown.Item>
                                                <Dropdown.Item className="fs-14" size="small" onClick={() => { setSelectedItem(item); setStockModalOpen(true); }}>Stock</Dropdown.Item>
                                                <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => setSelectedItem(item) || setDeleteModalOpen(true)}>Delete</Dropdown.Item>
                                            </DropdownButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            component="div"
                            count={totalItems}
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

            {/* Form Modal */}
            <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
                <Box className="custom_modal" sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
                    boxShadow: 12, borderRadius: 2
                }}>
                    <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? "Edit" : "Create"} Cafeteria Item</Typography>
                    <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField size="small" label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth required />
                        <TextField size="small" label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} fullWidth required />
                        <TextField size="small" label="Price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} fullWidth required />
                        <TextField size="small" label="Stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} fullWidth required />
                        <input type="file" accept="image/*" onChange={handleImageChange} />
                        {previewImage && <img src={previewImage} alt="Preview" width="100" height="100" />}
                        <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            {/* Delete Modal */}
            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <Box sx={{ p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center" }}>
                    <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>Are you sure you want to delete <b>{selectedItem?.name}</b>?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Stock Add/Remove Modal */}
            <Modal open={stockModalOpen} onClose={() => setStockModalOpen(false)}>
                <Box className="custom_modal" sx={{ width: 400, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 24, mx: 'auto', mt: 10 }}>
                    <Typography variant="h6" gutterBottom>Update Stock for {selectedItem?.name}</Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField label="Quantity" type="number" name="quantity" value={stockForm.quantity} onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })} fullWidth required />
                        <TextField label="Reason" name="reason" value={stockForm.reason} onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })} fullWidth required />
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="contained" color="success" onClick={() => handleStockSubmit('add')}>Add</Button>
                            <Button variant="contained" color="error" onClick={() => handleStockSubmit('remove')}>Remove</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>

            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default Cafeteria;