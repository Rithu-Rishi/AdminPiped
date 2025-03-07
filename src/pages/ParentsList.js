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

// Sample Data
function createData(pname, eMale, mobile, childrens, gender) {
  return { pname, eMale, mobile, childrens, gender };
}

const initialRows = [
  createData('John Doe', 'john@example.com', 9876543210, 2, 'Male'),
  createData('Jane Smith', 'jane@example.com', 9234567890, 1, 'Male'),
  createData('Michael Johnson', 'michael@example.com', 9123456789, 3, 'Female'),
  createData('Emily Davis', 'emily@example.com', 9871234560, 2, 'Male'),
  createData('Chris Brown', 'chris@example.com', 9543216780, 1, 'Female'),
  createData('Sarah Wilson', 'sarah@example.com', 9654321789, 3, 'Male'),
  createData('David Miller', 'david@example.com', 9987654321, 2, 'Female'),
  createData('Emma Taylor', 'emma@example.com', 9345678901, 1, 'Male'),
  createData('Daniel Anderson', 'daniel@example.com', 9212345678, 3, 'Female'),
  createData('Sophia Thomas', 'sophia@example.com', 9765432109, 2, 'Male'),
  createData('James White', 'james@example.com', 9876123450, 1, 'Female'),
  createData('Olivia Harris', 'olivia@example.com', 9321098765, 3, 'Male'),
  createData('Benjamin Martin', 'benjamin@example.com', 9456789012, 2, 'Female'),
  createData('Mia Clark', 'mia@example.com', 9654321098, 1, 'Male'),
  createData('William Lewis', 'william@example.com', 9876541230, 3, 'Female'),
  createData('Charlotte Lee', 'charlotte@example.com', 9432109876, 2, 'Male'),
  createData('Alexander Hall', 'alexander@example.com', 9123450987, 1, 'Female'),
  createData('Amelia Walker', 'amelia@example.com', 9761234509, 3, 'Male'),
  createData('Ethan Allen', 'ethan@example.com', 9870432156, 2, 'Female'),
  createData('Isabella Scott', 'isabella@example.com', 9342156789, 1, 'Male'),
];

const ParentsList = () => {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({ pname: '', eMale: '', mobile: '', childrens: '', gender: '' });

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
    setFormData(row || { pname: '', eMale: '', mobile: '', childrens: '', gender: '' });
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
        <h3>Parents List</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Parent
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Parent Name</TableCell>
              <TableCell>Email Id</TableCell>
              <TableCell>Mobile No</TableCell>
              <TableCell># Childrens</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.pname}>
                <TableCell>{row.pname}</TableCell>
                <TableCell>{row.eMale}</TableCell>
                <TableCell>{row.mobile}</TableCell>
                <TableCell>{row.childrens}</TableCell>
                <TableCell>{row.gender}</TableCell>
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
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
            Are you sure you want to delete <b>{selectedRow?.pname}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={closeDeleteModal} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Parent Modal */}
      <Modal open={formModalOpen} onClose={closeFormModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper',
          boxShadow: 12, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>{selectedRow ? 'Edit Parent' : 'Create Parent'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Parent Name" name="pname" value={formData.pname} onChange={handleChange} fullWidth />
              <TextField size='small' label="Email" name="eMale" value={formData.eMale} onChange={handleChange} fullWidth />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} fullWidth />
              <TextField size='small' label="Number of Children" name="childrens" value={formData.childrens} onChange={handleChange} fullWidth />
            </Box>
            {/* Gender Select Field */}
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select label="Gender" size='small'
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
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

export default ParentsList;
