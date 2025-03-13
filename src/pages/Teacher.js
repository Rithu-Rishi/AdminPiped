import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField,
  TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { getAllTeachers, addTeacher, updateTeacher, deleteTeacher } from "../services/teachersApi";


const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: "", email: "", mobile_number: "", date_of_birth: "",
    designation: "", bio: "", experiences: "", awards: "", certifications: "", teacher_image: null,
  });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const fetchTeachers = async (page) => {
    try {
      const response = await getAllTeachers(page);
      setTeachers(response.data || []);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      setError("Failed to fetch teachers.");
    }
  };

  const openFormModal = (teacher = null) => {
    if (teacher) {
      setFormData(teacher);
      setEditId(teacher.id);
      setPreviewImage(teacher.teacher_image);
    } else {
      setFormData({
        name: "", email: "", mobile_number: "", date_of_birth: "",
        designation: "", bio: "", experiences: "", awards: "", certifications: "", teacher_image: null
      });
      setEditId(null);
      setPreviewImage(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    await deleteTeacher(selectedRow.id);
    setDeleteModalOpen(false);
    fetchTeachers();
  };

  // Handle Input Change in Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, teacher_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Validation
  // const isFormValid = () => {
  //   return Object.values(formData).every(value => value !== '');
  // };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateTeacher(editId, formData);
      } else {
        await addTeacher(formData);
      }
      setFormModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setError("Failed to save teacher.");
    }
  };

  // Handle Pagination
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Teacher List</h5>
        <div>
          <Button size='small' variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Teacher
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(teachers) && teachers.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.teacher_image && <img src={`https://pipe.mosol9.in/${row.teacher_image}`} alt={row.name} width="50" height="50" />}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.mobile_number}</TableCell>
                <TableCell>{row.date_of_birth}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => openFormModal(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => setSelectedRow(row) || setDeleteModalOpen(true)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          className="custom_pagination"
          component="div"
          count={totalPages * rowsPerPage}
          page={page - 1}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={() => { }}
        />
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper',
          boxShadow: 24, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>Confirm Deletion</Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete <b>{selectedRow?.name}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Teacher Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 24, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>{editId ? 'Edit Teacher' : 'Create Teacher'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 2, pr: 2 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
              <TextField size='small' label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
            </Box>

            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} fullWidth required />
              <TextField size='small' label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth required />
            </Box>
            <TextField size='small' label="Designation" name="designation" value={formData.designation} onChange={handleChange} fullWidth required />
            <TextField size='small' label="Bio" name="bio" multiline rows={2} value={formData.bio} onChange={handleChange} fullWidth required />
            <TextField size='small' label="Experiences" name="experiences" multiline rows={2} value={formData.experiences} onChange={handleChange} fullWidth required />
            <TextField size='small' label="Awards" name="awards" multiline rows={2} value={formData.awards} onChange={handleChange} fullWidth required />
            <TextField size='small' label="Certifications" name="certifications" multiline rows={2} value={formData.certifications} onChange={handleChange} fullWidth required />

            <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={handleImageChange} />
            {previewImage && <img src={previewImage} alt="Preview" width="100" height="100" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editId ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Teacher;
