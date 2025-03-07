import React, { useEffect, useState } from "react";
import { getAllPrograms, addProgram, updateProgram, deleteProgram } from "../services/programsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_name: "", program_desc: "", program_image: null,
    age_group: "", monthly_fee: "", discount_percent: "", final_amount: ""
  });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchPrograms(page);
  }, [page]);

  const fetchPrograms = async (page) => {
    try {
      const response = await getAllPrograms(page);
      console.log(response);
      setPrograms(response || []);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch programs.");
    }
  };

  // Handle Input Change in Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "monthly_fee" || name === "discount_percent") {
      const monthlyFee = parseFloat(updatedData.monthly_fee) || 0;
      const discount = parseFloat(updatedData.discount_percent) || 0;
      updatedData.final_amount = (monthlyFee - (monthlyFee * discount / 100)).toFixed(2);
    }
    setFormData(updatedData);
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateProgram(editId, formData);
      } else {
        await addProgram(formData);
      }
      setFormModalOpen(false);
      fetchPrograms(page);
    } catch (err) {
      console.error("Failed to save program.");
    }
  };

  const openFormModal = (program = null) => {
    if (program) {
      setFormData(program);
      setEditId(program.id);
      setPreviewImage(program.program_image);
    } else {
      setFormData({
        program_name: "", program_desc: "", program_image: null,
        age_group: "", monthly_fee: "", discount_percent: "", final_amount: ""
      });
      setEditId(null);
      setPreviewImage(null);
    }
    setFormModalOpen(true);
  };

  const handleDelete = async () => {
    await deleteProgram(selectedRow.id);
    setDeleteModalOpen(false);
    fetchPrograms(page);
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, program_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between mb-2'>
        <h3>All Programs</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Program
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Program Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Description</TableCell>
              <TableCell width={100}>Age</TableCell>
              <TableCell>Fees</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Final Amount</TableCell>
              <TableCell width={100} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {programs.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.program_name}</TableCell>
                <TableCell>{row.program_image && <img src={`http://localhost:8000/${row.program_image}`} alt={row.program_name} width="50" height="50" />}</TableCell>
                <TableCell>{row.program_desc}</TableCell>
                <TableCell>{row.age_group} Yrs</TableCell>
                <TableCell>{row.monthly_fee}</TableCell>
                <TableCell>{row.discount_percent}</TableCell>
                <TableCell>{row.final_amount}</TableCell>
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
          component="div"
          count={totalPages * rowsPerPage}
          page={page - 1}
          onPageChange={(event, newPage) => setPage(newPage + 1)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
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
            Are you sure you want to delete <b>{selectedRow?.program_name}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 12, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>{selectedRow ? 'Edit Program' : 'Create Program'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Program Name" name="program_name" value={formData.program_name} onChange={handleChange} fullWidth />
              <TextField size='small' label="Programs Age" name="age_group" value={formData.age_group} onChange={handleChange} fullWidth />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Program Fee" name="monthly_fee" value={formData.monthly_fee} onChange={handleChange} fullWidth />
              <TextField size='small' label="Discount" name="discount_percent" value={formData.discount_percent} onChange={handleChange} fullWidth />
            </Box>
            <TextField size='small' multiline rows={2} label="Programs Description" name="program_desc" value={formData.program_desc} onChange={handleChange} fullWidth />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {previewImage && <img src={previewImage} alt="Preview" width="100" height="100" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {selectedRow ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default Programs;
