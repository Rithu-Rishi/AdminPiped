import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, Box, Typography, TextField, InputAdornment,
  TablePagination
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IMAGE_BASE_URL } from "../config/constants";
import { Add as AddIcon, MoreVert as Menu, Search as SearchIcon } from "@mui/icons-material";
import { getAllTeachers, addTeacher, updateTeacher, deleteTeacher } from "../services/teachersApi";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { formatDate } from '../utils/dateUtils';
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import NoData from "../includes/NoData";
import ExportCSVButton from "../pages/ExportCSVButton";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: "", email: "", mobile_number: "", date_of_birth: "",
    designation: "", bio: "", experiences: "", awards: "", certifications: "", teacher_image: null,
  });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
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


  // Fetch teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await getAllTeachers({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      setTeachers(response.data || []);
      setTotalCount(response.total || 0);
    } catch (err) {
      setAlertMessage({ open: true, type: "error", message: "Failed to fetch teachers." });
    }
    setLoading(false);
  };

  const openFormModal = (teacher = null) => {
    if (teacher) {
      setFormData(teacher);
      setEditId(teacher.id);
      setPreviewImage(`${IMAGE_BASE_URL}${teacher.profile_pic_url}`);
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
    const response = await deleteTeacher(selectedRow.id);
    if (response) {
      setAlertMessage({ open: true, type: "success", message: response.message });
    }
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
    if (file && file.size <= 2 * 1024 * 1024) {
      setFormData({ ...formData, teacher_image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Image size must be less than 2MB");
    }
  };

  // Form Validation
  const isFormValid = () => {
    return Object.entries(formData).every(([key, value]) => key === 'teacher_image' || value !== "");
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await updateTeacher(editId, formData);
        setAlertMessage({ open: true, type: "success", message: "Teacher updated successfully!" });
      } else {
        await addTeacher(formData);
        setAlertMessage({ open: true, type: "success", message: "Teacher added successfully!" });
      }
      setFormModalOpen(false);
      fetchTeachers();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };



  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Teacher List</h5>

        <div className='d-flex align-items-center gap-2'>
          <TextField className="search_icon"
            size="small" placeholder="Search..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="fs-14 text-primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Teacher
          </Button>
          {/* <ExportCSVButton
            fetchAllData={async () => {
              const response = await getAllTeachers({ page: 1, per_page: 10000, search: debouncedSearch });
              return response.data || [];
            }}
            headers={[
              "Name",
              "Email",
              "Mobile Number",
              "Date of Birth",
              "Designation",
              "Bio",
              "Experiences",
              "Awards",
              "Certifications"
            ]}
            rowMapper={row => [
              row.name || "",
              row.email || "",
              row.mobile_number || "",
              row.date_of_birth || "",
              row.designation || "",
              row.bio || "",
              row.experiences || "",
              row.awards || "",
              row.certifications || ""
            ]}
            fileName="teachers.csv"
            onError={() => setAlertMessage({ open: true, type: "error", message: "Failed to fetch all teachers for export." })}
          /> */}
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
          <NoData />
        )
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{
          p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center"
        }}>
          <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete <b>{selectedRow?.name}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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
                selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
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

export default Teacher;
