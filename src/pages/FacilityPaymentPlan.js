import React, { useEffect, useState } from "react";
import { getAllFacilityPlans, addFacilityPlan, updateFacilityPlan, deleteFacilityPlan } from "../services/facilityApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Modal, Box, Typography, TextField, TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon } from "@mui/icons-material";

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

    useEffect(() => {
        fetchFacilityPlans();
    }, [page]);

    const fetchFacilityPlans = async () => {
        try {
            const response = await getAllFacilityPlans();
            setPlans(response || []);
        } catch (err) {
            console.error("Failed to fetch facility payment plans.");
        }
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
    };

    const openDeleteModal = (plan) => {
        setSelectedPlan(plan);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedPlan) return;
        try {
            await deleteFacilityPlan(selectedPlan.id);
            setDeleteModalOpen(false);
            fetchFacilityPlans();
        } catch (err) {
            console.error("Failed to delete facility payment plan.");
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => openFormModal()}>
                Add Facility Plan
            </Button>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Duration (Months)</TableCell>
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
                                <TableCell>{plan.duration_months}</TableCell>
                                <TableCell>{plan.amount}</TableCell>
                                <TableCell>{plan.discount_percent}</TableCell>
                                <TableCell>{plan.inital_kit_amount}</TableCell>
                                <TableCell>{plan.final_amount}</TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => openFormModal(plan)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => openDeleteModal(plan)}>
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
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
                <Box sx={{ p: 3, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 10 }}>
                    <Typography variant="h6">{editId ? "Edit Facility Plan" : "Add Facility Plan"}</Typography>
                    {formData.plans.map((plan, index) => (
                        <Box key={index} sx={{ mb: 2, position: "relative" }}>
                            <TextField label="Duration (Months)" name="duration_months" value={plan.duration_months} onChange={(e) => handleChange(index, "duration_months", e.target.value)} fullWidth margin="normal" />
                            <TextField label="Amount" name="amount" value={plan.amount} onChange={(e) => handleChange(index, "amount", e.target.value)} fullWidth margin="normal" />
                            <TextField label="Discount (%)" name="discount_percent" value={plan.discount_percent} onChange={(e) => handleChange(index, "discount_percent", e.target.value)} fullWidth margin="normal" />
                            <TextField label="Initial Kit Amount" name="inital_kit_amount" value={plan.inital_kit_amount} onChange={(e) => handleChange(index, "inital_kit_amount", e.target.value)} fullWidth margin="normal" />
                            <TextField label="Final Amount" name="final_amount" value={plan.final_amount} disabled fullWidth margin="normal" />
                            {!editId && (
                                <IconButton color="error" onClick={() => removeRow(index)} sx={{ position: "absolute", top: 10, right: 10 }}>
                                    <CloseIcon />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    {!editId && (
                        <Button variant="outlined" color="primary" onClick={addRow} sx={{ mb: 2 }}>+ Add Row</Button>
                    )}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default FacilityPaymentPlans;