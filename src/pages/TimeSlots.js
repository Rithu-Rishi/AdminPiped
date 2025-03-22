import React, { useEffect, useState } from "react";
import { getAllTimeSlots, addTimeSlot, updateTimeSlot, deleteTimeSlot } from "../services/timeslotApi";
import { getDropDownPrograms } from "../services/programsApi";
import { getProgramSkillLevels } from "../services/skillLevelApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, FormControl,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, ToggleButton, ToggleButtonGroup, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Close as CloseIcon, MoreVert as Menu } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useDebounce from "../hooks/useDebounce";

const weekDaysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [formData, setFormData] = useState({
    program_id: "", skill_level_id: "", week_days: [],
    time_ranges: [{ start_time: "", end_time: "", available_slots: "" }]
  });
  const [editId, setEditId] = useState(null);
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

  useEffect(() => {
    fetchTimeSlots();
    fetchPrograms();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const response = await getAllTimeSlots({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      console.log("time slots ", response);
      setTimeSlots(response.data || []);
      setTotalCount(response.total || 0);
      // Reset page if out of range
      // if (page >= Math.ceil(response.length / rowsPerPage)) {
      //   setPage(0);
      // }
    } catch (err) {
      console.error("Failed to fetch timeslots.");
    }
    setLoading(false);
  };

  const fetchPrograms = async () => {
    try {
      const response = await getDropDownPrograms();
      setPrograms(response.data || []);
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
    const program_id = e.target.value;
    setFormData({ ...formData, program_id, skill_level_id: "" });
    fetchSkillLevels(program_id);
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
    const updated = [...formData.time_ranges];
    updated[index][field] = value;
    setFormData({ ...formData, time_ranges: updated });
  };

  const openFormModal = async (row = null) => {
    if (row) {
      await fetchSkillLevels(row.program_id); // Ensure skill levels are loaded before setting formData
      setFormData({
        program_id: row.program_id || "",
        skill_level_id: row.skill_level_id || "",
        week_days: row.week_days || [],
        time_ranges: row.time_ranges ? row.time_ranges.map(range => ({ ...range })) : [{ start_time: "", end_time: "", available_slots: "" }]
      });
      setEditId(row.id);
    } else {
      setFormData({
        program_id: "", skill_level_id: "", week_days: [],
        time_ranges: [{ start_time: "", end_time: "", available_slots: "" }]
      });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    setLoading(true);
    await deleteTimeSlot(selectedRow.id);
    setDeleteModalOpen(false);
    setLoading(false);
    fetchTimeSlots();
  };

  const handleWeekDayChange = (_, newDays) => {
    setFormData({ ...formData, week_days: newDays });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
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
    setLoading(false);
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
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Time Slots</h5>

        <div className='d-flex justify-content-between gap-2'>
          <TextField
            placeholder="Search..." size="small" value={searchTerm} onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Time Slot
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        timeSlots.length > 0 ? (
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
                    <TableCell>{slot.program?.program_name}</TableCell>
                    <TableCell>{slot.skill_level.skill_name}</TableCell>
                    <TableCell>{slot.week_days.map((day) => weekDaysList[day]).join(", ")}</TableCell>
                    <TableCell>
                      {slot.time_ranges.map((range, index) => (
                        <div key={index}>{range.start_time} - {range.end_time} ({range.available_slots} slots)</div>
                      ))}
                      {/* <TableCell>{slot.time_ranges.map(t => `${t.start_time} - ${t.end_time} (${t.available_slots} slots)`).join(", ")}</TableCell> */}
                    </TableCell>
                    <TableCell align="center">
                      <DropdownButton
                        align="end"
                        title={<Menu />}
                        size='sm'
                        className="custom_dropdown"
                      >
                        <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(slot)}>Edit</Dropdown.Item>
                        <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => setSelectedRow(slot) || setDeleteModalOpen(true)}>Delete</Dropdown.Item>
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
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </TableContainer>
        ) : (
          <Typography variant="body1" align="center">No Data Available</Typography>
        )
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{
          p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center"
        }}>
          <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete <b>{selectedRow?.ProgramName}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClose={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Time Slot' : 'Create Time Slot'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className="d-flex" sx={{ gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="label-helper">Select Program</InputLabel>
                <Select size="small" fullWidth name="program_id" labelId="label-helper" label="Select Program" value={formData.program_id} onChange={handleProgramChange}>
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="label-helper-one">Select Skill Level</InputLabel>
                <Select size="small" fullWidth name="skill_level_id" labelId="label-helper-One" label="Select Skill Level" value={formData.skill_level_id} onChange={(e) => setFormData({ ...formData, skill_level_id: e.target.value })}>
                  {skillLevels.map((level) => (
                    <MenuItem key={level.id} value={level.id}>{level.skill_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <h6 className="mb-0">Select Week Days:</h6>
            <ToggleButtonGroup size="small" value={formData.week_days} onChange={handleWeekDayChange} aria-label="week days" fullWidth>
              {weekDaysList.map((day, index) => (
                <ToggleButton key={index} className="selected" value={index}>{day}</ToggleButton>
              ))}
            </ToggleButtonGroup>

            {formData.time_ranges.map((range, index) => (
              <Box key={index} className="d-flex align-items-center" sx={{ gap: 2 }}>
                <TextField size="small" label="Start Time" value={range.start_time} onChange={(e) => handleChangeTimeRange(index, "start_time", e.target.value)} />
                <TextField size="small" label="End Time" value={range.end_time} onChange={(e) => handleChangeTimeRange(index, "end_time", e.target.value)} />
                <TextField size="small" label="Available Slots" value={range.available_slots} onChange={(e) => handleChangeTimeRange(index, "available_slots", e.target.value)} />
                <IconButton className="text-danger" onClick={() => handleRemoveTimeRange(index)}><CloseIcon /></IconButton>
              </Box>
            ))}
            <div>
              <Button size="small" color="success" variant="contained" onClick={handleAddTimeRange} startIcon={<AddIcon />}>Add Time Range</Button>
            </div>
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
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

export default TimeSlots;
