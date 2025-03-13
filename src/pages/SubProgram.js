import React, { useEffect, useState } from "react";
import { getAllSubPrograms, addSubProgram, updateSubProgram, deleteSubProgram } from "../services/subprogramsApi";
import { getAllPrograms } from "../services/programsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Close as CloseIcon } from "@mui/icons-material";

const SubPrograms = () => {
  const [subPrograms, setSubPrograms] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_id: "", sub_title: "", keywords: "", images: [], image_titles: [], image_colors: [], deleted_images: []
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSubPrograms(page);
    fetchPrograms();
  }, [page]);

  const fetchSubPrograms = async (page) => {
    try {
      const response = await getAllSubPrograms(page);
      console.log(response);
      setSubPrograms(response || []);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch sub-programs.");
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

  // Handle Delete
  const handleDelete = async () => {
    await deleteSubProgram(selectedRow.id);
    setDeleteModalOpen(false);
    fetchSubPrograms(page);
  };

  // Handle Input Change in Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   setFormData({ ...formData, images: files, image_titles: Array(files.length).fill(""), image_colors: Array(files.length).fill("") });
  // };

  // const handleImageDetailChange = (index, field, value) => {
  //   const updatedArray = [...formData[field]];
  //   updatedArray[index] = value;
  //   setFormData({ ...formData, [field]: updatedArray });
  // };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    try {
      if (editId) {
        await updateSubProgram(editId, formData);
      } else {
        await addSubProgram(formData);
      }
      setFormModalOpen(false);
      fetchSubPrograms(page);
    } catch (err) {
      console.error("Failed to save sub-program.");
    }
  };

  const openFormModal = (subProgram = null) => {
    if (subProgram) {
      setFormData({
        program_id: subProgram.program_id,
        sub_title: subProgram.sub_title,
        keywords: subProgram.keywords,
        images: subProgram.images.map(img => img.path) || [],
        image_titles: subProgram.images ? subProgram.images.map(img => img.title || "") : [],
        image_colors: subProgram.images ? subProgram.images.map(img => img.color_code || "") : [],
        deleted_images: []
      });
      setEditId(subProgram.id);
    } else {
      setFormData({ program_id: "", sub_title: "", keywords: "", images: [], image_titles: [], image_colors: [], deleted_images: [] });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  const handleRemoveImage = (index, imageId) => {
    setFormData((prevData) => {
      const updatedImages = [...prevData.images];
      const updatedTitles = [...prevData.image_titles];
      const updatedColors = [...prevData.image_colors];
      updatedImages.splice(index, 1);
      updatedTitles.splice(index, 1);
      updatedColors.splice(index, 1);
      const updatedDeletedImages = imageId ? [...prevData.deleted_images, imageId] : prevData.deleted_images;
      return { ...prevData, images: updatedImages, image_titles: updatedTitles, image_colors: updatedColors, deleted_images: updatedDeletedImages };
    });
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between mb-2'>
        <h3>Sub Programs</h3>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
          Create Sub Program
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Program</TableCell>
              <TableCell>Sub Program Title</TableCell>
              <TableCell>Keywords</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subPrograms.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.program.program_name}</TableCell>
                <TableCell>{row.sub_title}</TableCell>
                <TableCell>{row.keywords}</TableCell>
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
            Are you sure you want to delete <b>{selectedRow?.sub_title}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      {/* <Modal open={formModalOpen} onClose={closeFormModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 12, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>{selectedRow ? 'Edit Sub Program' : 'Create Sub Program'}</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <TextField label="Sub Program Title" name="sub_title" value={formData.sub_title} onChange={handleChange} fullWidth />
            <TextField label="Keywords" name="keywords" value={formData.keywords} onChange={handleChange} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={closeFormModal} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {selectedRow ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal> */}

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 12, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>{editId ? 'Edit Sub Program' : 'Create Sub Program'}</Typography>
          <Box component="form" sx={{ gap: 2 }}>
            <Select size="small" fullWidth name="program_id" value={formData.program_id} onChange={handleChange}>
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
              ))}
            </Select>
            <TextField size="small" className="mt-3" label="Sub Program Title" name="sub_title" value={formData.sub_title} onChange={handleChange} fullWidth required />
            <TextField size="small" className="mt-3" label="Keywords" name="keywords" value={formData.keywords} onChange={handleChange} fullWidth required />
            <input type="file" multiple accept="image/*" onChange={(e) => setFormData({ ...formData, images: [...formData.images, ...Array.from(e.target.files)] })} />
            {formData.images.map((img, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: '16px' }}>
                <img src={typeof img === 'string' ? `http://localhost:8000/${img}` : URL.createObjectURL(img)} alt="Preview" width="50" height="50" />
                <TextField label="Image Title" value={formData.image_titles[index] || ""} onChange={(e) => {
                  const updatedTitles = [...formData.image_titles];
                  updatedTitles[index] = e.target.value;
                  setFormData({ ...formData, image_titles: updatedTitles });
                }} fullWidth required />
                <TextField label="Image Color" value={formData.image_colors[index] || ""} onChange={(e) => {
                  const updatedColors = [...formData.image_colors];
                  updatedColors[index] = e.target.value;
                  setFormData({ ...formData, image_colors: updatedColors });
                }} fullWidth required />
                <IconButton color="error" onClick={() => handleRemoveImage(index, img.id)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default SubPrograms;
