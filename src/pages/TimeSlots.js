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
import ButtonGroup from '@mui/material/ButtonGroup';

// Sample Data
function createData(ProgramName, Skill_level, WeekDays, StartTime, EndTime, availableSlots) {
  return { ProgramName, Skill_level, WeekDays, StartTime, EndTime, availableSlots };
}

const initialRows = [
  createData('Dance', 'Beginer', 'Mon, tue', '1 PM', '2 PM', 'slots'),
];



const TimeSlots = () => {
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [formData, setFormData] = useState({ ProgramName: '', Skill_level: '', WeekDays: '', StartTime: '', EndTime: '', availableSlots: '' });

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
    setFormData(row || { ProgramName: '', Skill_level: '', WeekDays: '', StartTime: '', EndTime: '', availableSlots: '' });
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
        <h3>Time Slots</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Time Slot
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Program Name</TableCell>
              <TableCell>Skill Level</TableCell>
              <TableCell>Week Days</TableCell>
              <TableCell>Start TIme</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Available Slots</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.ProgramName}>
                <TableCell>{row.ProgramName}</TableCell>
                <TableCell>{row.Skill_level}</TableCell>
                <TableCell>{row.WeekDays}</TableCell>
                <TableCell>{row.StartTime}</TableCell>
                <TableCell>{row.EndTime}</TableCell>
                <TableCell>{row.availableSlots}</TableCell>
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
            Are you sure you want to delete <b>{selectedRow?.ProgramName}</b>?
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
          transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper',
          boxShadow: 24, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>{selectedRow ? 'Edit Time Slot' : 'Create Time Slot'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            <Box className='d-flex' sx={{ gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Program Name</InputLabel>
                <Select size='small'
                  name="ProgramName"
                  value={formData.ProgramName}
                  onChange={handleChange}
                  label='Program Name'
                >
                  <MenuItem value="dance">Dance</MenuItem>
                  <MenuItem value="music">Music</MenuItem>
                  <MenuItem value="vocal">Vocal</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Skill Level</InputLabel>
                <Select size='small'
                  name="Skill_level"
                  value={formData.Skill_level}
                  onChange={handleChange}
                  label="Skill Level"
                >
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Intermediate">Intermediate</MenuItem>
                  <MenuItem value="Advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <ButtonGroup aria-label="Basic button group">
              <Button>Mon</Button>
              <Button>Tue</Button>
              <Button>Wed</Button>
              <Button>Thur</Button>
              <Button>Fri</Button>
              <Button>Sat</Button>
              <Button>Sun</Button>
            </ButtonGroup>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Start Time" name="StartTime" value={formData.StartTime} onChange={handleChange} fullWidth />
              <TextField size='small' label="End Time" name="EndTime" value={formData.EndTime} onChange={handleChange} fullWidth />
              <TextField size='small' label="Available Slots" name="availableSlots" value={formData.availableSlots} onChange={handleChange} fullWidth />
            </Box>
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

export default TimeSlots;
