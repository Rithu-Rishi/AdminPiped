import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField,
  TablePagination
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IMAGE_BASE_URL } from "../config/constants";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, MoreVert as Menu } from "@mui/icons-material";
import { getAllTeachers, addTeacher, updateTeacher, deleteTeacher } from "../services/teachersApi";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { formatDate } from '../utils/dateUtils';

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
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers(page);
  }, [page]);

  const fetchTeachers = async (page) => {
    setLoading(true);
    try {
      const response = await getAllTeachers(page);
      setTeachers(response.data || []);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      setError("Failed to fetch teachers.");
    }
    setLoading(false);
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
    setLoading(true);
    await deleteTeacher(selectedRow.id);
    setDeleteModalOpen(false);
    setLoading(false);
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
    setLoading(true);
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
    setLoading(false);
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

      {loading ? <Spinner loading={loading} /> : (
        teachers.length > 0 ? (
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
                      {row.profile_pic_url && <img src={`${IMAGE_BASE_URL}${row.profile_pic_url}`} alt={row.name} width="40" height="40" className='rounded-5 border border-2' />}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.mobile_number}</TableCell>
                    <TableCell>{formatDate(row.date_of_birth)}</TableCell>
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
              count={totalPages * rowsPerPage}
              page={page - 1}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={() => { }}
            />
          </TableContainer>
        ) : (
          <Typography variant="body1" align="center">No Data Available</Typography>
        )
      )}

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
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Teacher' : 'Create Teacher'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
              <TextField size='small' label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
            </Box>

            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} fullWidth required />
              {/* <TextField size='small' label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth required /> */}
              <DatePicker
                selected={formData.date_of_birth}
                onChange={(date) => setFormData({ ...formData, date_of_birth: date ? date.toISOString().split("T")[0] : "" })}
                dateFormat="dd MMM, yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                className="form-control date_filed" required
                placeholderText="Date of Birth"
              />
              <TextField size='small' label="Designation" name="designation" value={formData.designation} onChange={handleChange} fullWidth required />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Bio" name="bio" multiline rows={2} value={formData.bio} onChange={handleChange} fullWidth required />
              <TextField size='small' label="Experiences" name="experiences" multiline rows={2} value={formData.experiences} onChange={handleChange} fullWidth required />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Awards" name="awards" multiline rows={2} value={formData.awards} onChange={handleChange} fullWidth required />
              <TextField size='small' label="Certifications" name="certifications" multiline rows={2} value={formData.certifications} onChange={handleChange} fullWidth required />
            </Box>




            <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={handleImageChange} />
            {previewImage && <img src={previewImage} alt="Preview" width="100" height="100" />}
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
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

export default Teacher;
