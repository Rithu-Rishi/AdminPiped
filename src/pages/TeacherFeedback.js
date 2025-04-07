import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Modal, Box, Typography, TextField
} from "@mui/material";
import { MoreVert as Menu } from "@mui/icons-material";
import { getTeacherFeedbacks, approveFeedback, rejectFeedback, updateFeedback } from "../services/feedbackApi";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

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

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await getTeacherFeedbacks();
            console.log("respson ", response);
            setFeedbacks(response.data);
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

            {loading ? <Spinner loading={loading} /> : (
                <TableContainer component={Paper} className="table-container">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Child</TableCell>
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
                                    <TableCell>{row.program?.program_name}</TableCell>
                                    <TableCell>{row.sub_program_focus?.title}</TableCell>
                                    <TableCell>{row.skill_level?.skill_name}</TableCell>
                                    <TableCell>{row.comments}</TableCell>
                                    <TableCell>{row.status}</TableCell>
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
                </TableContainer>
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
