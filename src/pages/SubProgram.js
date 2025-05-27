import React, { useEffect, useState } from "react";
import { getAllSubPrograms, addSubProgram, updateSubProgram, deleteSubProgram } from "../services/subprogramsApi";
import { getDropDownPrograms } from "../services/programsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, FormControl,
  Button, IconButton, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon, MoreVert as Menu, Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { IMAGE_BASE_URL } from "../config/constants";
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import NoData from "../includes/NoData";

const SubPrograms = () => {
  const [subPrograms, setSubPrograms] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_id: "", sub_title: "", keywords: "", images: [], image_titles: [], image_colors: [], deleted_images: [], updated_images: []
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
    fetchSubPrograms();
    fetchPrograms();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchSubPrograms = async () => {
    setLoading(true);
    try {
      const response = await getAllSubPrograms({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      setSubPrograms(response.data || []);
      setTotalCount(response.total || 0);
    } catch (err) {
      console.error("Failed to fetch sub-programs.");
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

  // Handle Delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSubProgram(selectedRow.id);
      setAlertMessage({ open: true, type: "success", message: "Sub Program deleted successfully!" });
      setDeleteModalOpen(false);
      fetchSubPrograms();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
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
    if (!formData.program_id || !formData.sub_title || !formData.keywords) {
      setAlertMessage({ open: true, type: "error", message: "Please fill all required fields." });
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        let payload = new FormData();

        payload.append("program_id", formData.program_id);
        payload.append("sub_title", formData.sub_title);
        payload.append("keywords", formData.keywords);
        // Filter and send only NEWLY uploaded images
        formData.images.forEach((img, index) => {
          if (img instanceof File) {
            payload.append("images[]", img);
            payload.append("image_titles[]", formData.image_titles[index]);
            payload.append("image_colors[]", formData.image_colors[index]);
          }
        });

        if (Array.isArray(formData.updated_images) && formData.updated_images.length > 0) {
          formData.updated_images.forEach((img, index) => {
            payload.append(`updated_images[${index}][id]`, img.id);
            payload.append(`updated_images[${index}][title]`, img.title);
            payload.append(`updated_images[${index}][color_code]`, img.color_code);
            if (img.file) {
              payload.append(`updated_images[${index}][file]`, img.file);
            }
          });
        }
        if (formData.deleted_images.length > 0) {
          formData.deleted_images.forEach((imageId) => payload.append("deleted_images[]", imageId));
        }

        await updateSubProgram(editId, payload);
        setAlertMessage({ open: true, type: "success", message: "Sub Program updated successfully!" });
      } else {
        await addSubProgram(formData);
        setAlertMessage({ open: true, type: "success", message: "Sub Program created successfully!" });
      }
      setFormModalOpen(false);
      fetchSubPrograms(page);
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };

  const openFormModal = (subProgram = null) => {
    if (subProgram) {
      const existingUpdatedImages = (subProgram.images || []).map((img) => ({
        id: img.id,
        title: img.title || "",
        color_code: img.color_code || "",
        file: null, // Existing images have no new file yet
      }));

      setFormData({
        program_id: subProgram.program_id,
        sub_title: subProgram.sub_title,
        keywords: subProgram.keywords,
        images: subProgram.images || [],
        image_titles: subProgram.images?.map(img => img.title || ""),
        image_colors: subProgram.images?.map(img => img.color_code || ""),
        deleted_images: [],
        updated_images: existingUpdatedImages
      });
      
      setEditId(subProgram.id);
    } else {
      setFormData({ program_id: "", sub_title: "", keywords: "", images: [], image_titles: [], image_colors: [], deleted_images: [], updated_images: [] });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  const handleRemoveImage = (index, imageId) => {
    setFormData((prevData) => {
      const updatedImages = [...prevData.images];
      const updatedTitles = [...prevData.image_titles];
      const updatedColors = [...prevData.image_colors];
      // const imageToDelete = updatedImages[index];
      updatedImages.splice(index, 1);
      updatedTitles.splice(index, 1);
      updatedColors.splice(index, 1);
      const updatedDeletedImages = imageId ? [...prevData.deleted_images, imageId] : prevData.deleted_images;
      return { ...prevData, images: updatedImages, image_titles: updatedTitles, image_colors: updatedColors, deleted_images: updatedDeletedImages };
    });
  };

  const handleNewImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      setAlertMessage({ open: true, type: "error", message: "Only images below 2MB are allowed." });
    }

    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files]
    }));
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Sub Programs</h5>

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
            Create Sub Program
          </Button>
        </div>
      </div>

      {/* Show Spinner while loading */}
      {loading ? <Spinner loading={loading} /> : (
        subPrograms.length > 0 ? (
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
                    <TableCell>{row.program?.program_name}</TableCell>
                    <TableCell>{row.sub_title}</TableCell>
                    <TableCell>{row.keywords}</TableCell>
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
            Are you sure you want to delete <b>{selectedRow?.sub_title}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Child Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box className="custom_modal" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 12, borderRadius: 2 }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Sub Program' : 'Create Sub Program'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="label-helper">Select Program</InputLabel>
              <Select size="small" fullWidth name="program_id" labelId="label-helper" label="Select Program" value={formData.program_id} onChange={handleChange} disabled={!!editId}>
                {programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField size="small" className="mt-3" label="Sub Program Title" name="sub_title" value={formData.sub_title} onChange={handleChange} fullWidth required />
            <TextField size="small" className="mt-3" label="Keywords" name="keywords" value={formData.keywords} onChange={handleChange} fullWidth required />
            <input type="file" className="mt-3 rounded-2 border w-100 p-2 " multiple accept="image/*" onChange={handleNewImageUpload} />
            <div className="form-text text-warning fs-10">&#128712; * (Allow only below 2MB size)</div>
            {formData.images.map((img, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <img src={typeof img.path === 'string' ? `${IMAGE_BASE_URL}${img.path}` : URL.createObjectURL(img)} alt="Preview" className="rounded-3" width="40" height="40" />
                <TextField label="Image Title" size="small" value={formData.image_titles[index] || ""} onChange={(e) => {
                  const updatedTitles = [...formData.image_titles];
                  updatedTitles[index] = e.target.value;
                  const updatedImages = [...formData.updated_images];
                  if (updatedImages[index]) {
                    updatedImages[index].title = e.target.value;
                  }
                  setFormData(prev => ({
                    ...prev,
                    image_titles: updatedTitles,
                    updated_images: updatedImages,
                  }));
                }} fullWidth required />
                <TextField label="Image Color" type="color" size="small" value={formData.image_colors[index] || ""} onChange={(e) => {
                  const updatedColors = [...formData.image_colors];
                  updatedColors[index] = e.target.value;
                  const updatedImages = [...formData.updated_images];
                  if (updatedImages[index]) {
                    updatedImages[index].color_code = e.target.value;
                  }
                  setFormData(prev => ({
                    ...prev,
                    image_colors: updatedColors,
                    updated_images: updatedImages,
                  }));
                }} fullWidth required />
                <IconButton color="error" onClick={() => handleRemoveImage(index, img.id)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>{editId ? 'Update' : 'Create'}</Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar Alert */}
      <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
    </>
  );
}

export default SubPrograms;
