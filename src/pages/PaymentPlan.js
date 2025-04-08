import React, { useEffect, useState } from "react";
import { getAllPaymentPlans, addPaymentPlans, updatePaymentPlan, deletePaymentPlan } from "../services/paymentPlanApi";
import { getDropDownPrograms } from "../services/programsApi";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, FormControl,
    Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Close as CloseIcon, CurrencyRupee as CurrencyRupeeIcon, MoreVert as Menu } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";

const PaymentPlan = () => {
    const [plans, setPlans] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({ program_id: "", plans: [] });
    const [editId, setEditId] = useState(null);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchPaymentPlans();
        fetchPrograms();
    }, [page, rowsPerPage, debouncedSearch]);


    const fetchPaymentPlans = async () => {
        setLoading(true);
        try {
            const response = await getAllPaymentPlans({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
            console.log("payment plan ", response);
            setPlans(response.data || []);
            setTotalCount(response.total || 0);
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
        setLoading(false);
    };

    const fetchPrograms = async () => {
        try {
            const response = await getDropDownPrograms();
            setPrograms(response.data || []);
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
    };

    const calculateFinalAmount = (amount, discount) => {
        return amount - (amount * discount / 100);
    };

    const handleChange = (index, field, value) => {
        setFormData((prevData) => {
            const updatedPlans = [...prevData.plans];
            let plan = { ...updatedPlans[index], [field]: value };

            // Get monthly fee from selected program
            const selectedProgram = programs.find(p => p.id === prevData.program_id);
            const monthlyFee = selectedProgram?.monthly_fee || 0;

            // Calculate full amount based on duration
            const months = parseFloat(plan.duration_months || 0);
            //  plan.amount = monthlyFee * months;

            // Apply discount
            const discount = parseFloat(plan.discount_percent || 0);
            plan.final_amount = calculateFinalAmount((monthlyFee * months), discount);

            updatedPlans[index] = plan;

            return { ...prevData, plans: updatedPlans };
        });
    };

    const handleProgramSelect = (e) => {
        const selectedId = e.target.value;
        const selectedProgram = programs.find(p => p.id === selectedId);
        const monthlyFee = selectedProgram?.monthly_fee || 0;

        setFormData({
            program_id: selectedId,
            plans: [{
                ...formData.plans[0],
                amount: monthlyFee,
                duration_months: "",
                discount_percent: "",
                final_amount: ""
            }]
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (editId) {
                await updatePaymentPlan(editId, formData.plans[0]);
                setAlertMessage({ open: true, type: "success", message: "Payment Plan Created successfully!" });
            } else {
                const updatedPlans = formData.plans.map(plan => ({ ...plan, program_id: formData.program_id }));
                await addPaymentPlans({ plans: updatedPlans });
                setAlertMessage({ open: true, type: "success", message: "Payment Plan(s) Created successfully!" });
            }
            setFormModalOpen(false);
            fetchPaymentPlans(page);
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
        setLoading(false);
    };

    const openFormModal = (row = null) => {
        if (row) {
            setFormData({ plans: [{ ...row, program_id: row.program_id }] });
            setEditId(row.id);
        } else {
            setFormData({ program_id: "", plans: [{ program_id: "", duration_months: "", amount: "", discount_percent: 0, final_amount: "" }] });
            setEditId(null);
        }
        setFormModalOpen(true);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deletePaymentPlan(selectedRow.id);
            setAlertMessage({ open: true, type: "success", message: "Payment Plan deleted successfully!" });
            fetchPaymentPlans();
            setDeleteModalOpen(false);
        } catch (err) {
            handleApiError(err, setAlertMessage);
        }
        setLoading(false);
    };

    const addRow = () => {
        const selectedProgram = programs.find(p => p.id === formData.program_id);
        const monthlyFee = selectedProgram?.monthly_fee || 0;
        setFormData((prevData) => ({
            ...prevData,
            plans: [...prevData.plans, { duration_months: "", amount: monthlyFee, discount_percent: 0, final_amount: "" }]
        }));
    };

    const removeRow = (index) => {
        setFormData((prevData) => ({
            ...prevData,
            plans: prevData.plans.filter((_, i) => i !== index)
        }));
    };

    return (
        <>
            {/* Table */}
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5 className="mb-0">Payment Plans</h5>

                <div className="d-flex justify-content-between gap-2">
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
                    <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
                        Create Payment Plan
                    </Button>
                </div>
            </div>

            {loading ? <Spinner loading={loading} /> : (
                plans.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Program Name</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Discount (%)</TableCell>
                                    <TableCell>Final Amount</TableCell>
                                    <TableCell width={100} align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {plans.map((row, index) => (
                                    < TableRow key={row.id} >
                                        <TableCell>{row.program?.program_name}</TableCell>
                                        <TableCell>{row.duration_months} Months</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{row.amount}</TableCell>
                                        <TableCell>{row.discount_percent}</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{row.final_amount}</TableCell>
                                        <TableCell align="center">
                                            <DropdownButton
                                                align="end"
                                                title={<Menu />}
                                                size='sm'
                                                className="custom_dropdown"
                                            >
                                                <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(row)}>Edit</Dropdown.Item>
                                                <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => setSelectedRow(row) || setDeleteModalOpen(true)}>Delete</Dropdown.Item>
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
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
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
            < Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <Box sx={{
                    p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center"
                }}>
                    <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Are you sure you want to delete this payment plan?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
                    </Box>
                </Box>
            </Modal >

            {/* Add/Edit Child Modal */}
            < Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
                <Box className="custom_modal" sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper',
                    boxShadow: 12, borderRadius: 2
                }}>
                    <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Payment Plan' : 'Create Payment Plans'}</Typography>
                    <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {!editId && (
                            <FormControl size="small" fullWidth>
                                <InputLabel id="label-helper">Select Program</InputLabel>
                                <Select size="small" fullWidth name="program_id" labelId="label-helper" label="Select Program" value={formData.program_id} onChange={handleProgramSelect}>
                                    {programs.map((program) => (
                                        <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {formData.plans.map((plan, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField size="small" label="Duration (Months)" value={plan.duration_months} onChange={(e) => handleChange(index, "duration_months", e.target.value)} fullWidth required /> X
                                <TextField size="small" disabled label="Amount" value={plan.amount} onChange={(e) => handleChange(index, "amount", e.target.value)} fullWidth required /> -
                                <TextField size="small" label="Discount (%)" value={plan.discount_percent} onChange={(e) => handleChange(index, "discount_percent", e.target.value)} fullWidth required /> =
                                <TextField size="small" label="Final Amount" value={plan.final_amount} fullWidth disabled />
                                {!editId && (
                                    <IconButton color="error" onClick={() => removeRow(index)}>
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        {!editId && <Button size="small" variant="contained" color="success" onClick={addRow} startIcon={<AddIcon />}>Add Row</Button>}
                    </Box>
                    <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                        <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
                            {editId ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Snackbar Alert */}
            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default PaymentPlan;
