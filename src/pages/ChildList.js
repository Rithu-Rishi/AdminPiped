import React, { useEffect, useState } from "react";
import { getAllChildren, addChild, updateChild, deleteChild } from "../services/childApi";
import { getAllParents } from "../services/parentApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon } from "@mui/icons-material";

const ChildList = () => {
  const [children, setChildren] = useState([]);
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    parent_id: "",
    child_name: "",
    gender: "",
    date_of_birth: "",
    profile_image: null
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchChildren();
    fetchParents();
  }, [page]);

  const fetchChildren = async () => {
    try {
      const response = await getAllChildren();
      setChildren(response.data || []);
    } catch (err) {
      console.error("Failed to fetch children.");
    }
  };

  const fetchParents = async () => {
    try {
      const response = await getAllParents();
      setParents(response.data || []);
    } catch (err) {
      console.error("Failed to fetch parents.");
    }
  };

  // Handle Open Modals
  const openDeleteModal = (row) => {
    setSelectedChild(row);
    setDeleteModalOpen(true);
  };

  const openFormModal = (child = null) => {
    if (child) {
      setFormData({
        parent_id: child.parent_id ? String(child.parent_id) : "", // Ensure it's a string for Select
        child_name: child.child_name || "",
        gender: child.gender ? String(child.gender) : "", // Ensure it's a string for Select
        date_of_birth: child.date_of_birth || "",
        profile_image: null
      });
      setPreviewImage(child.profile_image);
      setEditId(child.id);
    } else {
      setFormData({ parent_id: "", child_name: "", gender: "", date_of_birth: "", profile_image: null });
      setPreviewImage(null);
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!selectedChild) return;
    try {
      await deleteChild(selectedChild.id);
      setDeleteModalOpen(false);
      fetchChildren();
    } catch (err) {
      console.error("Failed to delete child.");
    }
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
    try {
      if (editId) {
        await updateChild(editId, formData);
      } else {
        await addChild(formData);
      }
      setFormModalOpen(false);
      fetchChildren();
    } catch (err) {
      console.error("Failed to save child.");
    }
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between mb-2'>
        <h3>Child List</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Child
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Parent</TableCell>
              <TableCell>Child Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Profile Image</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {children.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.child_name}</TableCell>
                <TableCell>{row.child_name}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.date_of_birth}</TableCell>
                <TableCell>
                  {row.profile_image && <img src={row.profile_image} alt="Profile" width="50" height="50" />}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => openFormModal(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => openDeleteModal(row)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={children.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{ p: 3, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
          <Typography variant="h6">Confirm Deletion</Typography>
          <Typography>Are you sure you want to delete {selectedChild?.child_name}?</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box sx={{ p: 3, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 400, mx: "auto", mt: 10 }}>
          <Typography variant="h6">{editId ? "Edit Child" : "Add Child"}</Typography>
          <Select fullWidth name="parent_id" value={formData.parent_id} onChange={handleChange}>
            {parents.map((parent) => (
              <MenuItem key={parent.id} value={parent.id}>{parent.name}</MenuItem>
            ))}
          </Select>
          <TextField label="Child Name" name="child_name" value={formData.child_name} onChange={handleChange} fullWidth margin="normal" />
          <Select fullWidth name="gender" value={formData.gender} onChange={handleChange}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <TextField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth margin="normal" />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && <img src={previewImage} alt="Profile Preview" width="100" height="100" style={{ marginTop: 10 }} />}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editId ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default ChildList;
