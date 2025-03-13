import React, { useEffect, useState } from "react";
import { getAllSkillLevels, addSkillLevels, updateSkillLevels, deleteSkillLevel } from "../services/skillLevelApi";
import { getAllPrograms } from "../services/programsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon } from "@mui/icons-material";

const ProgramSkill = () => {
  const [skillLevels, setSkillLevels] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({ program_id: "", skills: [] });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSkillLevels(page);
    fetchPrograms();
  }, [page]);

  const fetchSkillLevels = async (page) => {
    try {
      const response = await getAllSkillLevels(page);
      console.log("skill level", response);
      setSkillLevels(response || []);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch skill levels.");
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

  const openFormModal = (row = null) => {
    if (row) {
      setFormData({
        program_id: row.program_id,
        skills: [{
          program_id: row.program_id,
          skill_name: row.skill_name,
          skill_description: row.skill_description,
          skill_period: row.skill_period,
          skill_amount: row.skill_amount,
          skill_discount: row.skill_discount,
        }]
      });
      setEditId(row.id);
    } else {
      setFormData({ program_id: "", skills: [{ skill_name: "", skill_description: "", skill_period: "", skill_amount: "", skill_discount: "" }] });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    await deleteSkillLevel(selectedRow.id);
    setDeleteModalOpen(false);
    fetchSkillLevels(page);
  };

  // Handle Input Change in Form
  const handleChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    updatedSkills[index].program_id = formData.program_id;
    setFormData({ ...formData, skills: updatedSkills });
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateSkillLevels(editId, formData.skills[0]);
      } else {
        console.log(formData);
        const updatedSkills = formData.skills.map(skill => ({ ...skill, program_id: formData.program_id }));
        console.log({ skills: updatedSkills });
        console.log(updatedSkills);
        await addSkillLevels({ skills: updatedSkills });
      }
      setFormModalOpen(false);
      fetchSkillLevels(page);
    } catch (err) {
      console.error("Failed to save skill levels.");
    }
  };

  // Add a Row
  const handleAddRow = () => {
    setFormData({ ...formData, skills: [...formData.skills, { program_id: formData.program_id, skill_name: "", skill_description: "", skill_period: "", skill_amount: "", skill_discount: "" }] });
  };

  // Delete a Row
  const handleRemoveRow = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({ ...formData, skills: updatedSkills });
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between mb-2'>
        <h3>Skill Level</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Skill Level
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Program</TableCell>
              <TableCell>Skill Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skillLevels.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.program.program_name}</TableCell>
                <TableCell>{row.skill_name}</TableCell>
                <TableCell>{row.skill_description}</TableCell>
                <TableCell>{row.skill_period}</TableCell>
                <TableCell>{row.skill_amount}</TableCell>
                <TableCell>{row.skill_discount}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" size="small" onClick={() => openFormModal(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small" onClick={() => { setSelectedRow(row); setDeleteModalOpen(true); }}>
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
            Are you sure you want to delete <b>{selectedRow?.skill_name}</b>?
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
          <Typography variant="h6" gutterBottom>{editId ? 'Edit Skill' : 'Create Skill'}</Typography>
          <Box component="form" sx={{ maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <Select size="small" fullWidth name="program_id" value={formData.program_id} onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}>
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
              ))}
            </Select>
            {formData.skills.map((skill, index) => (
              <Box component="form" key={`skill-${index}`} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
                <TextField size="small" label="Skill Name" value={skill.skill_name} onChange={(e) => handleChange(index, "skill_name", e.target.value)} fullWidth required />
                <Box className='d-flex' sx={{ gap: 2 }}>
                  <TextField size="small" label="Period" value={skill.skill_period} onChange={(e) => handleChange(index, "skill_period", e.target.value)} fullWidth required />
                  <TextField size="small" label="Amount" type="number" value={skill.skill_amount} onChange={(e) => handleChange(index, "skill_amount", e.target.value)} fullWidth required />
                  <TextField size="small" label="Discount" type="number" value={skill.skill_discount} onChange={(e) => handleChange(index, "skill_discount", e.target.value)} fullWidth required />
                </Box>
                <TextField size="small" label="Description" multiline rows={2} value={skill.skill_description} onChange={(e) => handleChange(index, "skill_description", e.target.value)} fullWidth required />
                {!editId && (<IconButton color="error" onClick={() => handleRemoveRow(index)}>
                  <CloseIcon />
                </IconButton>
                )}
              </Box>
            ))}
            {!editId && (
              <Button onClick={handleAddRow} startIcon={<AddIcon />}>Add Row</Button>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editId ? 'Update' : 'Create'}
            </Button>
          </Box>

        </Box>
      </Modal>
    </>
  );
}

export default ProgramSkill;
