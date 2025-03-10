import React, { useEffect, useState } from "react";
import { getAllTimeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot } from "../services/timeslotApi";
import { getAllPrograms } from "../services/programsApi";
import { getProgramSkillLevels } from "../services/skillLevelApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon } from "@mui/icons-material";

const weekDaysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [formData, setFormData] = useState({
    program_id: "",
    skill_level_id: "",
    week_days: [],
    time_ranges: [{ start_time: "", end_time: "", available_slots: "" }]
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchTimeSlots();
    fetchPrograms();
  }, [page]);

  const fetchTimeSlots = async () => {
    try {
      const response = await getAllTimeSlots();
      setTimeSlots(response || []);
      setTotalPages(response.last_page || 1);
      // Reset page if out of range
      if (page >= Math.ceil(response.length / rowsPerPage)) {
        setPage(0);
      }
    } catch (err) {
      console.error("Failed to fetch timeslots.");
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await getAllPrograms();
      setPrograms(response || []);
    } catch (err) {
      console.error("Failed to fetch programs.");
    }
  };

  const fetchSkillLevels = async (programId) => {
    try {
      const response = await getProgramSkillLevels(programId);
      console.log("sdags", response.skill_levels);
      setSkillLevels(response.skill_levels || []);
    } catch (err) {
      console.error("Failed to fetch skill levels.");
    }
  };

  const handleProgramChange = (e) => {
    const selectedProgramId = e.target.value;
    setFormData({ ...formData, program_id: selectedProgramId, skill_level_id: "" });
    fetchSkillLevels(selectedProgramId);
  };

  const handleAddTimeRange = () => {
    setFormData({
      ...formData,
      time_ranges: [...formData.time_ranges, { start_time: "", end_time: "", available_slots: "" }]
    });
  };

  const handleRemoveTimeRange = (index) => {
    const updatedTimeRanges = [...formData.time_ranges];
    updatedTimeRanges.splice(index, 1);
    setFormData({ ...formData, time_ranges: updatedTimeRanges });
  };

  const handleChangeTimeRange = (index, field, value) => {
    const updatedTimeRanges = [...formData.time_ranges];
    updatedTimeRanges[index][field] = value;
    setFormData({ ...formData, time_ranges: updatedTimeRanges });
  };

  const openFormModal = async (row = null) => {
    if (row) {
      await fetchSkillLevels(row.program_id); // Ensure skill levels are loaded before setting formData
      setFormData({
        program_id: row.program_id || "",
        skill_level_id: row.skill_level_id || "",
        week_days: row.week_days || [],
        time_ranges: row.time_ranges || [{ start_time: "", end_time: "", available_slots: "" }]
      });
      setEditId(row.id);
    } else {
      setFormData({
        program_id: "",
        skill_level_id: "",
        week_days: [],
        time_ranges: [{ start_time: "", end_time: "", available_slots: "" }]
      });
      setEditId(null);
    }
    setFormModalOpen(true);
  };



  // Handle Delete
  const handleDelete = async () => {
    await deleteTimeSlot(selectedRow.id);
    setDeleteModalOpen(false);
    fetchTimeSlots();
  };

  const handleWeekDayChange = (_, newDays) => {
    setFormData({ ...formData, week_days: newDays });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateTimeSlot(editId, formData);
      } else {
        await addTimeSlot(formData);
      }
      setFormModalOpen(false);
      fetchTimeSlots();
    } catch (err) {
      console.error("Failed to save timeslot.");
    }
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

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
              <TableCell>Program</TableCell>
              <TableCell>Skill Level</TableCell>
              <TableCell>Week Days</TableCell>
              <TableCell>Time Ranges</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{slot.program_name}</TableCell>
                <TableCell>{slot.skill_level_name}</TableCell>
                <TableCell>{slot.week_days.map((day) => weekDaysList[day]).join(", ")}</TableCell>
                <TableCell>
                  {slot.time_ranges.map((range, index) => (
                    <div key={index}>{range.start_time} - {range.end_time} ({range.available_slots} slots)</div>
                  ))}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => openFormModal(slot)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => setSelectedRow(slot) || setDeleteModalOpen(true)}>
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
          count={timeSlots.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
            Are you sure you want to delete <b>{selectedRow?.ProgramName}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClose={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>{editId ? 'Edit Time Slot' : 'Create Time Slot'}</Typography>
          <Select fullWidth name="program_id" value={formData.program_id} onChange={handleProgramChange}>
            {programs.map((program) => (
              <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
            ))}
          </Select>
          <Select fullWidth name="skill_level_id" value={formData.skill_level_id} onChange={(e) => setFormData({ ...formData, skill_level_id: e.target.value })}>
            {skillLevels.map((level) => (
              <MenuItem key={level.id} value={level.id}>{level.skill_name}</MenuItem>
            ))}
          </Select>
          <Typography>Select Week Days:</Typography>
          <ToggleButtonGroup size="small" value={formData.week_days} onChange={handleWeekDayChange} aria-label="week days" fullWidth>
            {weekDaysList.map((day, index) => (
              <ToggleButton key={index} value={index}>{day}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Button onClick={handleAddTimeRange}>Add Time Range</Button>
          {formData.time_ranges.map((range, index) => (
            <Box key={index}>
              <TextField label="Start Time" value={range.start_time} onChange={(e) => handleChangeTimeRange(index, "start_time", e.target.value)} />
              <TextField label="End Time" value={range.end_time} onChange={(e) => handleChangeTimeRange(index, "end_time", e.target.value)} />
              <TextField label="Available Slots" value={range.available_slots} onChange={(e) => handleChangeTimeRange(index, "available_slots", e.target.value)} />
              <IconButton onClick={() => handleRemoveTimeRange(index)}><CloseIcon /></IconButton>
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editId ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default TimeSlots;
