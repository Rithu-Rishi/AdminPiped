import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { DeleteOutline as DeleteOutlineIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import dance from "../assets/images/dance.webp";


function createData(tName, tPhoto, tCourse, tExp, tGender, tDes) {
  return { tName, tPhoto, tCourse, tExp, tGender, tDes };
}

const initialRows = [
  createData('Rajamouli', dance, 'Tabla', 12, 'Male', 'I am a professional in this course...'),
  createData('Rakesh Master', dance, 'Dance', 12, 'Male', 'I am a professional in this course...'),
  createData('Getha Madhuri', dance, 'Singing', 12, 'Male', 'I am a professional in this course...'),
  createData('Taman SS', dance, 'Music', 12, 'Male', 'I am a professional in this course...'),
];

const Teacher = () => {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({
    tName: '', tPhoto: '', tCourse: '', tExp: '', tGender: '', tDes: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Handle Pagination Changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle Open Modals
  const openDeleteModal = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const openFormModal = (row = null) => {
    setSelectedRow(row);
    setFormData(row || { tName: '', tPhoto: '', tCourse: '', tExp: '', tGender: '', tDes: '' });
    setImagePreview(row?.tPhoto || null);
    setFormModalOpen(true);
  };

  // Handle Close Modals
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const closeFormModal = () => setFormModalOpen(false);

  // Handle Delete
  const handleDelete = () => {
    setRows(rows.filter((row) => row !== selectedRow));
    closeDeleteModal();
  };

  // Handle Input Change in Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, tPhoto: URL.createObjectURL(file) });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Form Validation
  const isFormValid = () => {
    return Object.values(formData).every(value => value !== '');
  };

  // Handle Create/Edit Submit
  const handleSubmit = () => {
    if (selectedRow) {
      // Edit existing row
      setRows(rows.map(row => (row === selectedRow ? formData : row)));
    } else {
      // Add new row
      setRows([...rows, formData]);
    }
    closeFormModal();
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between mb-2'>
        <h3>Teacher List</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Teacher
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Teacher Name</TableCell>
              <TableCell>Teacher Photo</TableCell>
              <TableCell>Teacher Course</TableCell>
              <TableCell>Teacher Exp</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Teacher Description</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.tName}>
                <TableCell>{row.tName}</TableCell>
                <TableCell>
                  <img src={row.tPhoto} alt={row.tName} width="50" height="50" />
                </TableCell>
                <TableCell>{row.tCourse}</TableCell>
                <TableCell>{row.tExp}</TableCell>
                <TableCell>{row.tGender}</TableCell>
                <TableCell>{row.tDes}</TableCell>
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
        {rows.length > 5 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper',
          boxShadow: 24, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>Confirm Deletion</Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete <b>{selectedRow?.tName}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={closeDeleteModal} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Teacher Modal */}
      <Modal open={formModalOpen} onClose={closeFormModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper',
          boxShadow: 24, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>{selectedRow ? 'Edit Teacher' : 'Create Teacher'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Teacher Name" name="tName" value={formData.tName} onChange={handleChange} fullWidth required />
            <TextField label="Teacher Course" name="tCourse" value={formData.tCourse} onChange={handleChange} fullWidth required />
            <TextField label="Teacher Exp" name="tExp" value={formData.tExp} onChange={handleChange} fullWidth required />
            <TextField label="Teacher Description" name="tDes" value={formData.tDes} onChange={handleChange} fullWidth required />

            <FormControl fullWidth required>
              <InputLabel>Gender</InputLabel>
              <Select name="tGender" value={formData.tGender} onChange={handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" width="100" height="100" />}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={!isFormValid()}>
              {selectedRow ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Teacher;
