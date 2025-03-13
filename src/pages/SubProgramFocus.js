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
function createData(path, title, color_code) {
  return { path, title, color_code };
}

const initialRows = [
  createData('image.png', 'Odisi', '#FF5733'),
  createData('image.png', 'Western Dance', '#2980B9')
];

const SubProgramFocus = () => {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({ path: '', title: '', color_code: '' });

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
    setFormData(row || { path: '', title: '', color_code: '' });
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
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Sub Program Focus</h5>
        <div>
          <Button size='small' variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Sub Program Focus
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>color</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.title}>
                <TableCell>{row.path}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.color_code}</TableCell>
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
            className="custom_pagination"
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
            Are you sure you want to delete <b>{selectedRow?.title}</b>?
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
          <Typography variant="h6" gutterBottom>{selectedRow ? 'Edit Sub Program Focus' : 'Create Sub Program Focus'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <TextField size="small" label="Upload Image" name="path" value={formData.path} onChange={handleChange} fullWidth />
            <TextField size="small" label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth />
            <TextField size="small" type='color' label="Select Color" name="color_code" value={formData.color_code} onChange={handleChange} fullWidth />
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

export default SubProgramFocus;
