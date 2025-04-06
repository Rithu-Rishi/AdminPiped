import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, IconButton, Modal, Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Edit as EditIcon, CheckCircle, Cancel, Visibility as VisibilityIcon } from "@mui/icons-material";
import { getTeacherFeedbacks, approveFeedback, rejectFeedback, updateFeedback } from "../services/feedbackApi";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";

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
                <TableContainer component={Paper}>
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
                                    {row.status === "approved" || "rejected" &&
                                        <TableCell align="center">
                                            <IconButton onClick={() => handleView(row)}><VisibilityIcon /></IconButton>
                                            <IconButton color="primary" onClick={() => handleEdit(row)}><EditIcon /></IconButton>
                                            <IconButton color="success" onClick={() => handleApprove(row.id)}><CheckCircle /></IconButton>
                                            <IconButton color="error" onClick={() => handleReject(row.id)}><Cancel /></IconButton>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
                <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 600, mx: 'auto', mt: 10 }}>
                    <Typography variant="h6" gutterBottom>Edit Feedback</Typography>
                    {formData && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField name="comments" label="Comments" multiline rows={2} value={formData.comments} onChange={handleChange} fullWidth />
                            <TextField name="attendance_rating" label="Attendance Rating" value={formData.attendance_rating} onChange={handleChange} fullWidth />
                            <TextField name="participation_rating" label="Participation Rating" value={formData.participation_rating} onChange={handleChange} fullWidth />
                            <TextField name="skill_improvement_rating" label="Skill Improvement Rating" value={formData.skill_improvement_rating} onChange={handleChange} fullWidth />
                            <TextField name="focus_discipline_rating" label="Focus & Discipline Rating" value={formData.focus_discipline_rating} onChange={handleChange} fullWidth />
                            <TextField name="creativity_rating" label="Creativity Rating" value={formData.creativity_rating} onChange={handleChange} fullWidth />
                            <TextField name="milestone" label="Milestone" value={formData.milestone} onChange={handleChange} fullWidth />
                            <TextField name="next_month_goals" label="Next Month Goals" value={formData.next_month_goals} onChange={handleChange} fullWidth />
                            <Box textAlign="right">
                                <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* View Modal */}
            <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
                <Box className="custom_modal">
                    <Typography variant="h6">Feedback Details</Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography><strong>Comments:</strong> {formData.comments}</Typography>
                        <Typography><strong>Attendance Rating:</strong> {formData.attendance_rating}</Typography>
                        <Typography><strong>Participation Rating:</strong> {formData.participation_rating}</Typography>
                        <Typography><strong>Skill Improvement:</strong> {formData.skill_improvement_rating}</Typography>
                        <Typography><strong>Focus/Discipline:</strong> {formData.focus_discipline_rating}</Typography>
                        <Typography><strong>Creativity:</strong> {formData.creativity_rating}</Typography>
                        <Typography><strong>Milestone:</strong> {formData.milestone}</Typography>
                        <Typography><strong>Next Month Goals:</strong> {formData.next_month_goals}</Typography>
                    </Box>
                </Box>
            </Modal>

            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </>
    );
};

export default TeacherFeedback;
