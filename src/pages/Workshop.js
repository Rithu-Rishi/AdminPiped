import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Modal, Box, Typography, TextField,
   Switch
} from "@mui/material";
import { getAllWorkshops, addWorkshop, updateWorkshop, deleteWorkshop, toggleWorkshopStatus } from "../services/workShopApi";
import { Add as AddIcon, MoreVert as Menu } from "@mui/icons-material";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IMAGE_BASE_URL } from "../config/constants";
import AlertMessage from "../includes/AlertMessage";
import Spinner from "../includes/Spinner";
import { handleApiError } from "../utils/apiErrorHandler";

const WorkShop = () => {
  const [workshops, setWorkshops] = useState([]);
  const [formData, setFormData] = useState({
    workshop_name: "", date: "", time: "", link: "", image: "", is_active: true,
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const response = await getAllWorkshops();
      setWorkshops(response.workshops || []);
    } catch (err) {
      console.error("Failed to fetch workshops.");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await updateWorkshop(editId, formData);
        setAlertMessage({ open: true, type: "success", message: "Workshop updated successfully!" });
      } else {
        await addWorkshop(formData);
        setAlertMessage({ open: true, type: "success", message: "Workshop created successfully!" });
      }
      setFormModalOpen(false);
      fetchWorkshops();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteWorkshop(selectedRow.id);
      setDeleteModalOpen(false);
      setAlertMessage({
        open: true, type: "success", message: "Workshop deleted successfully!",
      });
      fetchWorkshops();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleWorkshopStatus(id);
      setAlertMessage({ open: true, type: "success", message: "Status updated successfully!" });
      fetchWorkshops();
    } catch (err) {
      console.error("Failed to update status.");
    }
  };

  const openFormModal = (row = null) => {
    if (row) {
      setFormData({
        workshop_name: row.workshop_name,
        date: row.date ? new Date(row.date) : null,
        time: row.time,
        link: row.link,
        image: row.image,
        is_active: row.is_active
      });
      setPreviewImage(row.image ? `${IMAGE_BASE_URL}${row.image}` : "");
      setEditId(row.id);
    } else {
      setFormData({
        workshop_name: "", date: "", time: "", link: "", image: "", is_active: true
      });
      setPreviewImage("");
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
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
        <h5 className="mb-0">Workshop Days</h5>
        <div>
          <Button size="small" variant="contained" color="success" onClick={() => openFormModal()} startIcon={<AddIcon />}>
            Add Workshop
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        workshops.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label=" simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Workshop Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workshops.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell><img src={`${IMAGE_BASE_URL}${row.image}`} alt={row.image} className="border border-1 rounded-2 p-1" width={60} /></TableCell>
                    <TableCell>{row.workshop_name}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.link}</TableCell>
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
          </TableContainer>
        ) : (
          <Typography variant="body1" align="center">No Data Available</Typography>
        )
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{ p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 500, mx: "auto", mt: 15, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete <b>{selectedRow?.workshop_name}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Workshop Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}
        aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? "Update ": "Add "} Workshop</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <TextField size="small" label="Workshop Name" name="workshop_name" value={formData.workshop_name} onChange={(e) => setFormData({ ...formData, workshop_name: e.target.value })} fullWidth required />
            {/* <TextField size="small" label="Date" type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} fullWidth required /> */}
            <DatePicker
              selected={formData.date}
              onChange={(date) => setFormData({ ...formData, date: date ? date.toISOString().split("T")[0] : "" })}
              dateFormat="dd MMM, yyyy"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              className="form-control"
              placeholderText="Date"
            />
            <TextField size="small" label="Time" name="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} fullWidth required />
            <TextField size="small" label="Link" name="link" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} fullWidth required />
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

export default WorkShop;
