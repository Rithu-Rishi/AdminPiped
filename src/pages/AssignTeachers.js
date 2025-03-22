import React, { useEffect, useState } from "react";
import { getDropDownPrograms } from "../services/programsApi";
import {
  getAllTeachers, getTeachersToProgram, assignTeachersToProgram, getProgramsWithTeachers,
  removeTeacherFromProgram
} from "../services/teachersApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, FormControl,
  Button, Modal, Box, Typography, Select, MenuItem, TablePagination, TextField, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, MoreVert as Menu } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useDebounce from "../hooks/useDebounce";

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
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchPrograms();
    fetchTeachers();
  }, [page]);

  useEffect(() => {
    fetchAssignments();
  }, [page]);

  const fetchPrograms = async () => {
    try {
      const response = await getDropDownPrograms();
      setPrograms(response.data || []);
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
      const response = await getProgramsWithTeachers({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      console.log("teachers", response);
      setAssignments(response.data || []);
      setTotalCount(response.total || 0);
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
      // const existingTeachers = assignments.find(p => p.program_id === selectedProgram)?.teachers.map(t => t.id) || [];
      // const updatedTeachers = [...new Set([...existingTeachers, ...selectedTeachers])];

      await assignTeachersToProgram(selectedProgram, { teacher_ids: selectedTeachers });
      setFormModalOpen(false);
      fetchAssignments();
      setSelectedProgram("");
      setSelectedTeachers([]);
      setAlertMessage({ open: true, type: "success", message: "Teachers assigned successfully!" });
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
      setAlertMessage({ open: true, type: "success", message: "Teacher removed successfully!" });
    } catch (err) {
      console.error("Failed to remove teacher.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Assign Teachers</h5>

        <div className="d-flex justify-content-between gap-2">
          <TextField className="search_icon" size="small" placeholder="Search..." value={searchTerm} onChange={(e) => {
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
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => setFormModalOpen(true)}>
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
                    <TableCell align="center">
                      <DropdownButton
                        align="end"
                        title={<Menu />}
                        size='sm'
                        className="custom_dropdown"
                      >
                        <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => openDeleteModal(row.program_id, row.teacher_id)}>Delete</Dropdown.Item>
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
              count={totalCount}
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
        <Box sx={{
          p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center"
        }}>
          <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to remove this teacher from the program?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
            <FormControl size="small" fullWidth>
              <InputLabel id="label-helper-one">Select Skill Level</InputLabel>
              <Select size="small" fullWidth name="program_id" labelId="label-helper-One" label="Select Program" value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)}>
                {programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Select size="small"
              fullWidth
              multiple
              value={selectedTeachers}
              onChange={(e) => setSelectedTeachers(e.target.value)}
              displayEmpty
              renderValue={(selected) => selected.length === 0 ? "Select Teachers" : selected.map(id => teachers.find(t => t.id === id)?.name).join(", ")}
            >
              <MenuItem disabled value="">Select Teachers</MenuItem>
              {teachers.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>{teacher.name}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Assign</Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar Alert */}
      <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
    </>
  );
}

export default AssignTeachers;
