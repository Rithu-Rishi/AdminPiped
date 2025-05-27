import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Modal, Box, Typography, TextField, InputAdornment, TablePagination
} from "@mui/material";
import { MoreVert as Menu } from "@mui/icons-material";
import { getTeacherFeedbacks, approveFeedback, rejectFeedback, updateFeedback } from "../services/feedbackApi";
import Spinner from "../includes/Spinner";
import { Search as SearchIcon } from "@mui/icons-material";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import NoData from "../includes/NoData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useDebounce from "../hooks/useDebounce";

const TeacherFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        comments: "",
        attendance_rating: "",
        participation_rating: "",
        skill_improvement_rating: "",
        focus_discipline_rating: "",
        creativity_rating: "",
        milestone: "",
        next_month_goals: ""
    });
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [alertMessage, setAlertMessage] = useState({ open: false, type: '', message: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0); // starts at 0
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        fetchFeedbacks();
    }, [page, rowsPerPage, debouncedSearch, startDate, endDate]);

    const fetchFeedbacks = async () => {
        if (startDate && !endDate) return;

        setLoading(true);

        const filters = {
            page: page + 1, // backend usually expects 1-based index
            per_page: rowsPerPage,
            search: debouncedSearch,
        };

        if (startDate && endDate) {
            filters.start_date = startDate.toISOString().split("T")[0];
            filters.end_date = endDate.toISOString().split("T")[0];
        }
        setLoading(true);
        try {
            const response = await getTeacherFeedbacks(filters);
            setFeedbacks(response.data || []);
            setTotalCount(response.total || 0);
        } catch (error) {
            setAlertMessage({ open: true, type: 'error', message: 'Failed to fetch feedbacks.' });
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            await approveFeedback(id);
            fetchFeedbacks();
            setAlertMessage({ open: true, type: 'success', message: 'Feedback approved.' });
        } catch (err) {
            setAlertMessage({ open: true, type: 'error', message: 'Failed to approve feedback.' });
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectFeedback(id);
            fetchFeedbacks();
            setAlertMessage({ open: true, type: 'success', message: 'Feedback rejected.' });
        } catch (err) {
            setAlertMessage({ open: true, type: 'error', message: 'Failed to reject feedback.' });
        }
    };

    const handleEdit = (row) => {
        setFormData({ ...row });
        setSelectedFeedback(row);
        setEditModalOpen(true);
    };

    const handleView = (row) => {
        setFormData({ ...row });
        setViewModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            await updateFeedback({ id: selectedFeedback.id, ...formData });
            setEditModalOpen(false);
            fetchFeedbacks();
            setAlertMessage({ open: true, type: 'success', message: 'Feedback updated successfully.' });
        } catch (error) {
            setAlertMessage({ open: true, type: 'error', message: 'Failed to update feedback.' });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <h5 className="mb-3">Teacher Feedback</h5>
            <div className="d-flex justify-content-end gap-2 mb-3">
                <div className="col-md-2">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Start Date"
                        className="form-control"
                        maxDate={new Date()}
                        dateFormat="dd MMM, yyyy"
                    />
                </div>
                <div className="col-md-2">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="End Date"
                        className="form-control"
                        minDate={startDate}
                        maxDate={new Date()}
                        dateFormat="dd MMM, yyyy"
                    />
                </div>
                <div className="">
                    <TextField className="search_icon"
                        placeholder="Search..." size="small" value={searchTerm} onChange={(e) => {
                            setSearchTerm(e.target.value);
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
                <Button variant="outlined" size="small" onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setSearchTerm("");
                }}>Reset</Button>
            </div>

            {loading ? <Spinner loading={loading} /> : (
                feedbacks.length > 0 ? (
                    <TableContainer component={Paper} className="table-container">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Child</TableCell>
                                    <TableCell>Teacher</TableCell>
                                    <TableCell>Program</TableCell>
                                    <TableCell>Sub Program</TableCell>
                                    <TableCell>Skill Level</TableCell>
                                    <TableCell>Comment</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feedbacks.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.child?.child_name}</TableCell>
                                        <TableCell>{row.teacher?.name}</TableCell>
                                        <TableCell>{row.program?.program_name}</TableCell>
                                        <TableCell>{row.sub_program_focus?.title}</TableCell>
                                        <TableCell>{row.skill_level?.skill_name}</TableCell>
                                        <TableCell>{row.comments}</TableCell>
                                        <TableCell>
                                            {row.status === "approved" ? (
                                                <span className="text-success bg-success bg-opacity-10 py-1 px-3 rounded-2">Approved</span>) : row.status === "rejected" ? (
                                                    <span className="text-danger bg-danger bg-opacity-10 py-1 px-3 rounded-2">Rejected</span>) : (
                                                <span className="text-warning bg-warning bg-opacity-10 py-1 px-3 rounded-2">Pending</span>)}
                                            {/* {row.status} */}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.status === "approved" || "rejected" &&
                                                <DropdownButton
                                                    align="end"
                                                    title={<Menu />}
                                                    size='sm'
                                                    className="custom_dropdown"

                                                >
                                                    <Dropdown.Item size="small" onClick={() => handleView(row)} className="fs-14 text-primary">View</Dropdown.Item>
                                                    <Dropdown.Item size="small" onClick={() => handleEdit(row)} className="fs-14 text-info">Edit</Dropdown.Item>
                                                    <Dropdown.Item size="small" onClick={() => handleApprove(row.id)} className="fs-14 text-success">Approve</Dropdown.Item>
                                                    <Dropdown.Item size="small" onClick={() => handleReject(row.id)} className="fs-14 text-danger">Reject</Dropdown.Item>
                                                </DropdownButton>
                                            }
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
                            onPageChange={(event, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(event) => {
                                setRowsPerPage(parseInt(event.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                        />
                    </TableContainer>
                ) : (
                    <NoData />
                )
            )}

            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Box className="custom_modal" sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper',
                    boxShadow: 12, borderRadius: 2
                }}>
                    <Typography variant="h6" className="custom_heading_modal" gutterBottom>Edit Feedback</Typography>
                    {formData && (
                        <>
                            <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField size="small" name="comments" label="Comments" multiline rows={2} value={formData.comments} onChange={handleChange} fullWidth />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField size="small" name="attendance_rating" label="Attendance Rating" value={formData.attendance_rating} onChange={handleChange} fullWidth />
                                    <TextField size="small" name="participation_rating" label="Participation Rating" value={formData.participation_rating} onChange={handleChange} fullWidth />
                                    <TextField size="small" name="skill_improvement_rating" label="Skill Improvement Rating" value={formData.skill_improvement_rating} onChange={handleChange} fullWidth />
                                    <TextField size="small" name="focus_discipline_rating" label="Focus & Discipline Rating" value={formData.focus_discipline_rating} onChange={handleChange} fullWidth />
                                    <TextField size="small" name="creativity_rating" label="Creativity Rating" value={formData.creativity_rating} onChange={handleChange} fullWidth />
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField multiline rows={2} size="small" name="milestone" label="Milestone" value={formData.milestone} onChange={handleChange} fullWidth />
                                    <TextField multiline rows={2} size="small" name="next_month_goals" label="Next Month Goals" value={formData.next_month_goals} onChange={handleChange} fullWidth />
                                </Box>
                            </Box>
                            <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                                <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>

            {/* View Modal */}
            <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
                <Box className="custom_modal" sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper',
                    boxShadow: 12, borderRadius: 2
                }}>
                    <Typography variant="h6" className="custom_heading_modal">Feedback Details</Typography>
                    <Box className="modal_body bg-white p-3" >
                        <p className="mb-1"><strong>Comments:</strong> {formData.comments}</p>
                        <p className="mb-1"><strong>Attendance Rating:</strong> {formData.attendance_rating}</p>
                        <p className="mb-1"><strong>Participation Rating:</strong> {formData.participation_rating}</p>
                        <p className="mb-1"><strong>Skill Improvement:</strong> {formData.skill_improvement_rating}</p>
                        <p className="mb-1"><strong>Focus/Discipline:</strong> {formData.focus_discipline_rating}</p>
                        <p className="mb-1"><strong>Creativity:</strong> {formData.creativity_rating}</p>
                        <p className="mb-1"><strong>Milestone:</strong> {formData.milestone}</p>
                        <p className="mb-1"><strong>Next Month Goals:</strong> {formData.next_month_goals}</p>
                    </Box>
                </Box>
            </Modal>

            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default TeacherFeedback;
