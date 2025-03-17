import React, { useEffect, useState } from "react";
import { getAllParents, addParent, updateParent, deleteParent } from "../services/parentApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, TablePagination
} from "@mui/material";
import { IMAGE_BASE_URL } from "../config/constants";
import { Add as AddIcon, MoreVert as Menu } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { formatDate } from '../utils/dateUtils';

const ParentsList = () => {
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    date_of_birth: "",
    profile_image: null
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });


  useEffect(() => {
    fetchParents();
  }, [page]);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await getAllParents();
      setParents(response.data || []);
    } catch (err) {
      console.error("Failed to fetch parents.");
    }
    setLoading(false);
  };

  const openFormModal = (parent = null) => {
    if (parent) {
      setFormData({
        name: parent.name || "",
        email: parent.email || "",
        mobile_number: parent.mobile_number || "",
        date_of_birth: parent.date_of_birth || "",
        profile_image: null
      });
      setPreviewImage(parent.profile_image);
      setEditId(parent.user_id);
    } else {
      setFormData({ name: "", email: "", mobile_number: "", date_of_birth: "", profile_image: null });
      setPreviewImage(null);
      setEditId(null);
    }
    setFormModalOpen(true);
  };


  // Handle Input Change in Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await updateParent(editId, formData);
      } else {
        await addParent(formData);
      }
      setFormModalOpen(false);
      fetchParents();
    } catch (err) {
      console.error("Failed to save parent.");
    }
    setLoading(false);
  };

  const openDeleteModal = (parent) => {
    setSelectedParent(parent);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!selectedParent) return;
    try {
      await deleteParent(selectedParent.id);
      setDeleteModalOpen(false);
      fetchParents();
    } catch (err) {
      console.error("Failed to delete parent.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Parents List</h5>
        <div>
          <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Parent
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        parents.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Profile Image</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parents.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.mobile_number}</TableCell>
                    <TableCell>{formatDate(row.date_of_birth)}</TableCell>
                    <TableCell>
                      {row.profile_image && <img src={`${IMAGE_BASE_URL}${row.profile_image}`} alt="Profile" width="50" height="50" />}
                    </TableCell>
                    <TableCell align="center">
                      <DropdownButton
                        align="end"
                        title={<Menu />}
                        size='sm'
                        className="custom_dropdown"
                      >
                        <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(row)}>Edit</Dropdown.Item>
                        <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => openDeleteModal(row)}>Delete</Dropdown.Item>
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
              count={parents.length}
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
        <Box sx={{ p: 3, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
          <Typography variant="h6">Confirm Deletion</Typography>
          <Typography>Are you sure you want to delete {selectedParent?.name}?</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Parent Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Parent' : 'Create Parent'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size="small" label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
              <TextField size="small" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size="small" label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} fullWidth />
              <TextField size="small" label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth />
            </Box>
            <input type="file" className="border p-2 rounded-2" accept="image/*" onChange={handleFileChange} />
            {previewImage && <img src={previewImage} alt="Profile Preview" width="100" height="100" style={{ marginTop: 10 }} />}
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
}

export default ParentsList;
