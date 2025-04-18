import React, { useEffect, useState } from "react";
import { getAllSkillProgressions, addSkillProgressions, updateSkillProgression, deleteSkillProgression } from "../services/skillProgressionApi";
import { getDropDownPrograms } from "../services/programsApi";
import { getSubProgramFocus } from "../services/subprogramsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, FormControl,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, InputAdornment
} from "@mui/material";
import { IMAGE_BASE_URL } from "../config/constants";
import { Add as AddIcon, Search as SearchIcon, Close as CloseIcon, MoreVert as Menu } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import NoData from "../includes/NoData";

const SkillProgression = () => {
  const [progressions, setProgressions] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subFocus, setSubFocus] = useState([]);
  const [formData, setFormData] = useState({
    program_id: "", focus_id: "", titles: [""], descriptions: [""], images: [], imagePreviews: [],
    title: "", description: "", image: null, imagePreview: "",
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
    fetchSkillProgressions();
    fetchPrograms();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchSkillProgressions = async () => {
    setLoading(true);
    try {
      const response = await getAllSkillProgressions({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      console.log("skill progression ", response);
      setProgressions(response.data || []);
      setTotalCount(response.total || 0);
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };

  const fetchPrograms = async () => {
    try {
      const response = await getDropDownPrograms();
      setPrograms(response.data || []);
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
  };

  const fetchSubProgramFocus = async (programId) => {
    try {
      const response = await getSubProgramFocus(programId);
      console.log("focus ", response);
      setSubFocus(response.sub_programs[0]['images'] || []);
    } catch (err) {
      console.error("Failed to fetch skill levels.");
    }
  };

  const handleProgramChange = (e) => {
    const program_id = e.target.value;
    setFormData({ ...formData, program_id, focus_id: "" });
    fetchSubProgramFocus(program_id);
  };

  const openFormModal = (row = null) => {
    if (row) {
      // Edit - Handling single row update
      setFormData({
        program_id: row.program_id || "",
        focus_id: row.focus_id || "",
        title: row.title || "",
        description: row.description || "",
        image: null,
        imagePreview: `${IMAGE_BASE_URL}${row.image}`
      });
      setEditId(row.id);
    } else {
      setFormData({
        program_id: "", focus_id: "",
        titles: [""], descriptions: [""], images: [], imagePreviews: [],
        title: "", description: "", image: null, imagePreview: "",
      });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSkillProgression(selectedRow.id);
      setAlertMessage({ open: true, type: "success", message: "Skill Progression deleted successfully!" });
      fetchSkillProgressions();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setDeleteModalOpen(false);
    setLoading(false);
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
    if (editId) {
      const preview = URL.createObjectURL(file);
      setFormData((prevData) => ({ ...prevData, image: file, imagePreview: preview }));
    } else {
      setFormData((prevData) => {
        const updatedImages = [...prevData.images];
        const updatedPreviews = [...prevData.imagePreviews];
        updatedImages[index] = file;
        updatedPreviews[index] = URL.createObjectURL(file);
        return { ...prevData, images: updatedImages, imagePreviews: updatedPreviews };
      });
    }
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    setLoading(true);
    console.log("before submit", formData);
    try {
      if (editId) {
        await updateSkillProgression(editId, formData);
        setAlertMessage({ open: true, type: "success", message: "Skill Progression updated successfully!" });
      } else {
        await addSkillProgressions(formData);
        setAlertMessage({ open: true, type: "success", message: "Skill Progression created successfully!" });
      }
      setFormModalOpen(false);
      fetchSkillProgressions(page);
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
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
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Skill Progression</h5>

        <div className='d-flex align-items-center gap-2'>
          <TextField className="search_icon"
            placeholder="Search..." size="small" value={searchTerm} onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="fs-14 text-primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Skill Progression
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        progressions.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell>Sub Program</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>

                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {progressions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.program?.program_name}</TableCell>
                    <TableCell>{row.sub_program_focus?.title}</TableCell>
                    <TableCell>{row.image && <img src={`${IMAGE_BASE_URL}${row.image}`} alt={row.program_name} className="border border-2 rounded-1 p-1" width="40" height="40" />}</TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell align="center">
                      <DropdownButton
                        align="end"
                        title={<Menu />}
                        size='sm'
                        className="custom_dropdown"
                      >
                        <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(row)}>Edit</Dropdown.Item>
                        <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => { setSelectedRow(row); setDeleteModalOpen(true) }}>Delete</Dropdown.Item>
                      </DropdownButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              className="custom_pagination"
              component="div"
              count={totalCount}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </TableContainer>
        ) : (
          <NoData />
        )
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{
          p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center"
        }}>
          <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete <b>{selectedRow?.title}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
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
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Skill Progression' : 'Create Skill Progression'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className="d-flex" sx={{ gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel id="label-helper">Select Program</InputLabel>
                <Select size="small" fullWidth name="program_id" labelId="label-helper" label="Select Program" value={formData.program_id} onChange={handleProgramChange} disabled={!!editId}>
                  {programs.map((program) => (
                    <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel id="label-helper-sub">Select Sub Program</InputLabel>
                <Select size="small" fullWidth name="focus_id" labelId="label-helper-sub" label="Select Sub Program" value={formData.focus_id} onChange={(e) => setFormData({ ...formData, focus_id: e.target.value })} disabled={!!editId}>
                  {subFocus.map((focus) => (
                    <MenuItem key={focus.id} value={focus.id}>{focus.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {editId ? (
              // Edit: Single Entry Form
              <>

                <TextField size="small" multiline rows={2} className="mb-3" label="Description" value={formData.description} onChange={(e) => handleChange(0, "description", e.target.value)} fullWidth required />
                <Box className="d-flex" sx={{ gap: 2 }}>
                  <TextField size="small" className="mb-3" label="Title" value={formData.title} onChange={(e) => handleChange(0, "title", e.target.value)} fullWidth required />
                  <input type="file" className="border rounded-2 w-100 p-2" style={{ height: '40px' }} accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                </Box>

                {formData.imagePreview && <img src={formData.imagePreview} className="mt-2" alt="Preview" width="50" height="50" />}
              </>
            ) : (
              // Create: Multiple Entries Form
              formData.titles.map((_, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
            {!editId && <Button variant="contained" color="success" onClick={addRow} startIcon={<AddIcon />}>Add Row</Button>}
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
              {editId ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Spinner */}
      <Spinner loading={loading} />
      {/* Snackbar Alert */}
      <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
    </>
  );
}

export default SkillProgression;
