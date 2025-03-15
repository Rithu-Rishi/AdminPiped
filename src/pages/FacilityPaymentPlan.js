import React, { useEffect, useState } from "react";
import { getAllFacilityPlans, addFacilityPlan, updateFacilityPlan, deleteFacilityPlan } from "../services/facilityApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Modal, Box, Typography, TextField, TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon, MoreVert as Menu, CurrencyRupee as CurrencyRupeeIcon  } from "@mui/icons-material";
import { Link } from "react-router";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const FacilityPaymentPlans = () => {
    const [plans, setPlans] = useState([]);
    const [formData, setFormData] = useState({
        plans: [
            { duration_months: "", amount: "", discount_percent: "", inital_kit_amount: "", final_amount: "" }
        ]
    });
    const [editId, setEditId] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

    useEffect(() => {
        fetchFacilityPlans();
    }, [page]);

    const fetchFacilityPlans = async () => {
        setLoading(true);
        try {
            const response = await getAllFacilityPlans();
            setPlans(response || []);
        } catch (err) {
            console.error("Failed to fetch facility payment plans.");
        }
        setLoading(false);
    };

    const openFormModal = (plan = null) => {
        if (plan) {
            setFormData({ plans: [{ ...plan }] });
            setEditId(plan.id);
        } else {
            setFormData({ plans: [{ duration_months: "", amount: "", discount_percent: "", inital_kit_amount: "", final_amount: "" }] });
            setEditId(null);
        }
        setFormModalOpen(true);
    };

    const calculateFinalAmount = (amount, discount, kitAmount) => {
        const discountAmount = (amount * discount) / 100;
        return Number(amount) - discountAmount + Number(kitAmount);
    };

    const handleChange = (index, field, value) => {
        const updatedPlans = [...formData.plans];
        updatedPlans[index][field] = value;
        if (field === "amount" || field === "discount_percent") {
            updatedPlans[index].final_amount = calculateFinalAmount(updatedPlans[index].amount, updatedPlans[index].discount_percent, updatedPlans[index].inital_kit_amount);
        }
        setFormData({ plans: updatedPlans });
    };

    const addRow = () => {
        setFormData({
            plans: [...formData.plans, { duration_months: "", amount: "", discount_percent: "", inital_kit_amount: "", final_amount: "" }]
        });
    };

    const removeRow = (index) => {
        const updatedPlans = formData.plans.filter((_, i) => i !== index);
        setFormData({ plans: updatedPlans });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (editId) {
                await updateFacilityPlan(editId, formData);
            } else {
                await addFacilityPlan(formData);
            }
            setFormModalOpen(false);
            fetchFacilityPlans();
        } catch (err) {
            console.error("Failed to save facility payment plan.");
        }
        setLoading(false);
    };

    const openDeleteModal = (plan) => {
        setSelectedPlan(plan);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        setLoading(true);
        if (!selectedPlan) return;
        try {
            await deleteFacilityPlan(selectedPlan.id);
            setDeleteModalOpen(false);
            fetchFacilityPlans();
        } catch (err) {
            console.error("Failed to delete facility payment plan.");
        }
        setLoading(false);
    };

    return (
        <>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5 className="mb-0">Facility Plans</h5>
                <div>
                    <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
                        Add Facility Plan
                    </Button>
                </div>
            </div>

            {loading ? <Spinner loading={loading} /> : (
                plans.length > 0 ? (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Discount (%)</TableCell>
                                    <TableCell>Initial Kit Amount</TableCell>
                                    <TableCell>Final Amount</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {plans.map((plan) => (
                                    <TableRow key={plan.id}>
                                        <TableCell>{plan.duration_months} Months</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{plan.amount}</TableCell>
                                        <TableCell>{plan.discount_percent}</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{plan.inital_kit_amount}</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{plan.final_amount}</TableCell>
                                        <TableCell>
                                            <DropdownButton
                                                align="end"
                                                title={<Menu />}
                                                size='sm'
                                                className="custom_dropdown"
                                            >
                                                <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(plan)}>Edit</Dropdown.Item>
                                                <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => openDeleteModal(plan)}>Delete</Dropdown.Item>
                                            </DropdownButton>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            className="custom_pagination"
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={plans.length}
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

            {/* Delete Confirmation Modal */}
            <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <Box sx={{ p: 3, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
                    <Typography variant="h6">Confirm Deletion</Typography>
                    <Typography>Are you sure you want to delete this facility plan?</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
                <Box className="custom_modal" sx={{ bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 600, mx: "auto", mt: 10 }}>
                    <Typography variant="h6" className="custom_heading_modal">{editId ? "Edit Facility Plan" : "Add Facility Plan"}</Typography>
                    <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
                        {formData.plans.map((plan, index) => (
                            <Box key={index} className='d-flex align-items-center' sx={{ gap: 2 }}>
                                <div>
                                    <Box className='d-flex' sx={{ gap: 2, mb: 2 }}>
                                        <TextField size="small" label="Duration (Months)" name="duration_months" value={plan.duration_months} onChange={(e) => handleChange(index, "duration_months", e.target.value)} fullWidth />
                                        <TextField size="small" label="Initial Kit Amount" name="inital_kit_amount" value={plan.inital_kit_amount} onChange={(e) => handleChange(index, "inital_kit_amount", e.target.value)} fullWidth />
                                    </Box>
                                    <Box className='d-flex' sx={{ gap: 2 }}>
                                        <TextField size="small" label="Amount" name="amount" value={plan.amount} onChange={(e) => handleChange(index, "amount", e.target.value)} fullWidth />
                                        <TextField size="small" label="Discount (%)" name="discount_percent" value={plan.discount_percent} onChange={(e) => handleChange(index, "discount_percent", e.target.value)} fullWidth />
                                        <TextField size="small" label="Final Amount" name="final_amount" value={plan.final_amount} disabled fullWidth />

                                    </Box>
                                </div>
                                {!editId && (
                                    <Link className="text-white bg-danger rounded-5" color="error" onClick={() => removeRow(index)} >
                                        <CloseIcon />
                                    </Link>
                                )}

                            </Box>
                        ))}
                        {!editId && (
                            <Button variant="contained" color="success" size="small" onClick={addRow} sx={{ mb: 2 }}>+ Add Row</Button>
                        )}
                    </Box>
                    <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                        <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
                    </Box>
                </Box>
            </Modal>

            {/* Snackbar Alert */}
            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default FacilityPaymentPlans;