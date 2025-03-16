import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, IconButton, Modal, Box, Typography, TextField,
  TablePagination, CircularProgress, Snackbar, Alert, Switch
} from "@mui/material";
import { getAllSliders, addSlider, updateSlider, deleteSlider, toggleSliderStatus, } from "../services/slidersApi";
import { Add as AddIcon, MoreVert as Menu } from "@mui/icons-material";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { IMAGE_BASE_URL } from "../config/constants";
import AlertMessage from "../includes/AlertMessage";

const Sliders = () => {
  const [sliders, setSliders] = useState([]);
  const [formData, setFormData] = useState({ slider_title: "", slider_caption: "", slide_image: null });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const response = await getAllSliders();
      setSliders(response.slides || []);
    } catch (err) {
      console.error("Failed to fetch sliders.");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await updateSlider(editId, formData);
        setAlertMessage({
          open: true, type: "success", message: "Slider updated successfully!",
        });
      } else {
        await addSlider(formData);
        setAlertMessage({
          open: true, type: "success", message: "Slider created successfully!",
        });
      }
      setFormModalOpen(false);
      fetchSliders();
    } catch (err) {
      setAlertMessage({
        open: true, type: "error", message: "Failed to save slider.",
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSlider(selectedRow.id);
      setDeleteModalOpen(false);
      setAlertMessage({
        open: true, type: "success", message: "Slider deleted successfully!",
      });
      fetchSliders();
    } catch (err) {
      setAlertMessage({
        open: true, type: "error", message: "Failed to delete slider.",
      });
    }
    setLoading(false);
  };

  const handleToggleStatus = async (id) => {
    setLoading(true);
    try {
      await toggleSliderStatus(id);
      setAlertMessage({
        open: true, type: "success", message: "Slider status updated!",
      });
      fetchSliders();
    } catch (err) {
      setAlertMessage({
        open: true, type: "error", message: "Failed to update slider status.",
      });
    }
    setLoading(false);
  };

  const openFormModal = (row = null) => {
    if (row) {
      setEditId(row.id);
      setFormData({
        slider_title: row.slider_title,
        slider_caption: row.slider_caption,
        slide_image: row.slide_image
      });
      setPreviewImage(row.slide_image ? `${IMAGE_BASE_URL}${row.slide_image}` : "");
    } else {
      setEditId(null);
      setPreviewImage("");
      setFormData({ slider_title: "", slider_caption: "", slide_image: "" });
    }
    setFormModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, slide_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Image Slider</h5>
        <div>
          <Button size="small" variant="contained" color="success" onClick={() => openFormModal()} startIcon={<AddIcon />}>
            Create Slider
          </Button>
        </div>
      </div>

      {loading ? (
        <CircularProgress />
      ) : sliders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table aria-label=" simple table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Caption</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sliders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell><img src={`${IMAGE_BASE_URL}${row.slide_image}`} width={60} /></TableCell>
                  <TableCell>{row.slider_title}</TableCell>
                  <TableCell>{row.slider_caption}</TableCell>
                  <TableCell>
                    <Switch checked={row.is_active === 1} onChange={() => handleToggleStatus(row.id)} />
                  </TableCell>
                  <TableCell align="center">
                    <DropdownButton
                      align="end"
                      title={<Menu />}
                      size='sm'
                      className="custom_dropdown"
                    >
                      <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(row)} >Edit</Dropdown.Item>
                      <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => { setSelectedRow(row); setDeleteModalOpen(true); }}>Delete</Dropdown.Item>
                    </DropdownButton>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sliders.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) =>
              setRowsPerPage(parseInt(event.target.value, 10))
            }
          />
        </TableContainer>
      ) : (
        <Typography variant="body1" align="center">
          No Data Available
        </Typography>
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Confirm Deletion</Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete <b>{selectedRow?.slider_title}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Slider Modal */}
      <Modal
        open={formModalOpen} onClose={() => setFormModalOpen(false)}
        aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>Add Slider</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <TextField size="small" label="Slider Title" name="slider_title" value={formData.slider_title} onChange={(e) => setFormData({ ...formData, slider_title: e.target.value })} fullWidth required />
            <TextField size="small" label="Slider Caption" name="slider_caption" value={formData.slider_caption} onChange={(e) => setFormData({ ...formData, slider_caption: e.target.value })} fullWidth required />
            <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={handleImageChange} />
            {previewImage && <img src={previewImage} alt="Preview" width="60" height="60" className="mt-2" />}
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

export default Sliders;
