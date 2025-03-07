import React, { useEffect, useState } from "react";
import { getAllSkillProgressions, addSkillProgressions, updateSkillProgression, deleteSkillProgression } from "../services/skillProgressionApi";
import { getAllPrograms } from "../services/programsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon } from "@mui/icons-material";

const SkillProgression = () => {
  const [progressions, setProgressions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({ program_id: "", titles: [""], descriptions: [""], images: [], imagePreviews: [] });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSkillProgressions(page);
    fetchPrograms();
  }, [page]);

  const fetchSkillProgressions = async (page) => {
    try {
      const response = await getAllSkillProgressions(page);
      setProgressions(response || []);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch skill progressions.");
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
      // Edit - Handling single row update
      setFormData({
        program_id: row.program_id || "",
        title: row.title || "",
        description: row.description || "",
        image: row.image || "",
        imagePreview: row.image_url || `http://localhost:8000/${row.image}`
      });
      setEditId(row.id);
    } else {
      setFormData({ program_id: "", titles: [""], descriptions: [""], images: [], imagePreviews: [] });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    await deleteSkillProgression(selectedRow.id);
    setDeleteModalOpen(false);
    fetchSkillProgressions(page);
  };

  // Handle Input Change in Form
  const handleChange = (index, field, value) => {
    setFormData((prevData) => {
      if (editId) {
        // Edit - Handle Single Entry
        return { ...prevData, [field]: value };
      } else {
        // Create - Handle Multiple Entries
        const updatedField = [...prevData[field]];
        updatedField[index] = value;
        return { ...prevData, [field]: updatedField };
      }
    });
  };

  const handleFileChange = (index, files) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    setFormData((prevData) => {
      if (editId) {
        // Edit - Single Image
        return { ...prevData, image: file };
      } else {
        // Create - Multiple Images
        const updatedImages = [...prevData.images];
        const updatedPreviews = [...prevData.imagePreviews];

        updatedImages[index] = file;
        updatedPreviews[index] = URL.createObjectURL(file);

        return { ...prevData, images: updatedImages, imagePreviews: updatedPreviews };
      }
    });
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    console.log("before submit", formData);
    try {
      if (editId) {
        await updateSkillProgression(editId, formData);
      } else {
        await addSkillProgressions(formData);
      }
      setFormModalOpen(false);
      fetchSkillProgressions(page);
    } catch (err) {
      console.error("Failed to save skill progression.");
    }
  };

  const addRow = () => {
    setFormData({
      ...formData,
      titles: [...formData.titles, ""],
      descriptions: [...formData.descriptions, ""],
      images: [...formData.images, null],
      imagePreviews: [...formData.imagePreviews, null],
    });
  };

  const removeRow = (index) => {
    setFormData({
      ...formData,
      titles: formData.titles.filter((_, i) => i !== index),
      descriptions: formData.descriptions.filter((_, i) => i !== index),
      images: formData.images.filter((_, i) => i !== index),
      imagePreviews: formData.imagePreviews.filter((_, i) => i !== index),
    });
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between mb-2'>
        <h3>Skill Progression</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Skill Progression
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {progressions.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.image}</TableCell>
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
            Are you sure you want to delete <b>{selectedRow?.title}</b>?
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
          <Typography variant="h6" gutterBottom>{editId ? 'Edit Skill Progression' : 'Create Skill Progression'}</Typography>
          {!editId && (
            <Select size="small" fullWidth name="program_id" value={formData.program_id} onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}>
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
              ))}
            </Select>
          )}
          {editId ? (
            // Edit: Single Entry Form
            <>

              <TextField size="small" multiline rows={2} className="mb-3" label="Description" value={formData.description} onChange={(e) => handleChange(0, "description", e.target.value)} fullWidth required />
              <Box className="d-flex" sx={{ gap: 2 }}>
                <TextField size="small" className="mb-3" label="Title" value={formData.title} onChange={(e) => handleChange(0, "title", e.target.value)} fullWidth required />
                <input type="file" className="border rounded-2 w-100 p-2" style={{height:'40px'}} accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
              </Box>

              {formData.imagePreview && <img src={formData.imagePreview} className="mt-2" alt="Preview" width="50" height="50" />}
            </>
          ) : (
            // Create: Multiple Entries Form
            formData.titles.map((_, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                <TextField size="small" label="Title" value={formData.titles[index]} onChange={(e) => handleChange(index, "titles", e.target.value)} fullWidth required />
                <TextField size="small" label="Description" value={formData.descriptions[index]} onChange={(e) => handleChange(index, "descriptions", e.target.value)} fullWidth required />
                <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={(e) => handleFileChange(index, e.target.files)} />
                {formData.imagePreviews[index] && <img src={formData.imagePreviews[index]} alt="Preview" width="50" height="50" />}
                <IconButton color="error" onClick={() => removeRow(index)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ))
          )}
          {!editId && <Button onClick={addRow} startIcon={<AddIcon />}>Add Row</Button>}
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

export default SkillProgression;
