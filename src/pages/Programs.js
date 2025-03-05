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

// Sample Data
function createData(program_name, program_image, program_desc, age_group, monthly_fee, discount_percent) {
  return { program_name, program_image, program_desc, age_group, monthly_fee, discount_percent };
}

const initialRows = [
  createData('Dance', 'bro.png', 'Dance is an art form that involves moving the body in a rhythmic way, often to music', '6 - 16', 1200.00, 0)
];



const Programs = () => {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({ program_name: '', program_image: '', program_desc: '', age_group: '', monthly_fee: '', discount_percent: '' });

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
    setFormData(row || { program_name: '', program_image: '', program_desc: '', age_group: '', monthly_fee: '', discount_percent: '' });
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
              <TableCell>Age</TableCell>
              <TableCell>Fees</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.program_name}>
                <TableCell>{row.program_name}</TableCell>
                <TableCell>{row.program_image}</TableCell>
                <TableCell>{row.program_desc}</TableCell>
                <TableCell>{row.age_group} Years</TableCell>
                <TableCell>{row.monthly_fee}</TableCell>
                <TableCell>{row.discount_percent}</TableCell>
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
            Are you sure you want to delete <b>{selectedRow?.program_name}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={closeDeleteModal} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={closeFormModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 12, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>{selectedRow ? 'Edit Program' : 'Create Program'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
                    
            <TextField label="Program Name" name="program_name" value={formData.program_name} onChange={handleChange} fullWidth />
            <TextField multiline rows={2} label="Programs Des" name="program_desc" value={formData.program_desc} onChange={handleChange} fullWidth />
            <TextField label="Programs Age" name="age_group" value={formData.age_group} onChange={handleChange} fullWidth />
            <TextField label="Program Fee" name="monthly_fee" value={formData.monthly_fee} onChange={handleChange} fullWidth />
            <TextField label="Discount" name="discount_percent" value={formData.discount_percent} onChange={handleChange} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={closeFormModal} sx={{ mr: 1 }}>Cancel</Button>
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
