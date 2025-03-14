import React, { useEffect, useState } from "react";
import { getAllPrograms } from "../services/programsApi";
import {
  getAllTeachers, getTeachersToProgram, assignTeachersToProgram, getProgramsWithTeachers,
  removeTeacherFromProgram
} from "../services/teachersApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, Select, MenuItem, TablePagination
} from "@mui/material";
import { Add as AddIcon, DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";


const AssignTeachers = () => {
  const [programs, setPrograms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedProgramForDelete, setSelectedProgramForDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

  useEffect(() => {
    fetchPrograms();
    fetchTeachers();
  }, [page]);

  useEffect(() => {
    fetchAssignments();
  }, [page]);

  const fetchPrograms = async () => {
    try {
      const response = await getAllPrograms();
      setPrograms(response || []);
    } catch (err) {
      console.error("Failed to fetch programs.");
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await getAllTeachers();
      setTeachers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch teachers.");
    }
    setLoading(false);
  };

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const response = await getProgramsWithTeachers();
      setAssignments(response || []);
    } catch (err) {
      console.error("Failed to fetch assigned teachers.");
    }
    setLoading(false);
  };


  // const openFormModal = (row = null) => {
  //   setSelectedRow(row);
  //   setFormData(row || { ProgramName: '', teachers: '' });
  //   setFormModalOpen(true);
  // };

  // Handle Close Modals
  // const closeDeleteModal = () => setDeleteModalOpen(false);
  // const closeFormModal = () => setFormModalOpen(false);

  // Handle Delete
  // const handleDelete = () => {
  //   setRows(rows.filter((row) => row !== selectedRow));
  //   closeDeleteModal();
  // };

  // Handle Input Change in Form
  // const handleChange = (e) => {
  //   const {
  //     target: { value },
  //   } = e;
  //   setPersonName(
  //     // On autofill we get a stringified value.
  //     typeof value === 'string' ? value.split(',') : value,
  //   );

  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    setLoading(true);
    if (!selectedProgram || selectedTeachers.length === 0) {
      alert("Please select a program and at least one teacher.");
      return;
    }
    try {
      const existingTeachers = assignments.find(p => p.program_id === selectedProgram)?.teachers.map(t => t.id) || [];
      const updatedTeachers = [...new Set([...existingTeachers, ...selectedTeachers])];

      await assignTeachersToProgram(selectedProgram, { teacher_ids: updatedTeachers });
      setFormModalOpen(false);
      fetchAssignments();
      alert("Teachers assigned successfully!");
    } catch (err) {
      console.error("Failed to assign teachers.");
    }
    setLoading(false);
  };

  const openDeleteModal = (programId, teacherId) => {
    setSelectedProgramForDelete(programId);
    setSelectedTeacher(teacherId);
    setDeleteModalOpen(true);
  };

  const handleRemoveTeacher = async () => {
    setLoading(true);
    if (!selectedProgramForDelete || !selectedTeacher) return;
    try {
      await removeTeacherFromProgram(selectedProgramForDelete, selectedTeacher);
      setDeleteModalOpen(false);
      fetchAssignments();
      alert("Teacher removed successfully!");
    } catch (err) {
      console.error("Failed to remove teacher.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Time Slots</h5>
        <div>
          <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setFormModalOpen(true)}>
            Assign Teacher
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        assignments.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Program Name</TableCell>
                  <TableCell>Assigned Teachers</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((row) => (
                  <TableRow key={`${row.program_id}-${row.teacher_id}`}>
                    <TableCell>{row.program_name}</TableCell>
                    <TableCell>{row.teacher_name}</TableCell>
                    <TableCell>
                      <IconButton color="error" size="small" onClick={() => openDeleteModal(row.program_id, row.teacher_id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              className="custom_pagination"
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={assignments.length}
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
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Confirm Deletion</Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to remove this teacher from the program?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleRemoveTeacher}>Remove</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>Assign Teacher</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <Select size="small" fullWidth name="program_id" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
              ))}
            </Select>
            <Select size="small"
              fullWidth
              multiple
              value={selectedTeachers}
              onChange={(e) => setSelectedTeachers(e.target.value)}
              renderValue={(selected) => selected.map(id => teachers.find(t => t.id === id)?.name).join(", ")}

            >
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>{teacher.name}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Create
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar Alert */}
      <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
    </>
  );
}

export default AssignTeachers;
