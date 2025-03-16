import React, { useEffect, useState } from "react";
import { getAllPrograms, addProgram, updateProgram, deleteProgram } from "../services/programsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, TextField, TablePagination
} from "@mui/material";
import { IMAGE_BASE_URL } from "../config/constants";
import { Add as AddIcon, Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, MoreVert as Menu, CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_name: "", program_desc: "", program_image: null, program_banner: null,
    age_group: "", monthly_fee: "", discount_percent: "", final_amount: ""
  });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

  useEffect(() => {
    fetchPrograms(page);
  }, [page]);

  const fetchPrograms = async (page) => {
    setLoading(true);
    try {
      const response = await getAllPrograms(page);
      console.log(response);
      setPrograms(response || []);
      setTotalPages(response.last_page || 1);
    } catch (err) {
      console.error("Failed to fetch programs.");
    }
    setLoading(false);
  };

  // Handle Input Change in Form
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "monthly_fee" || name === "discount_percent") {
      const monthlyFee = parseFloat(updatedData.monthly_fee) || 0;
      const discount = parseFloat(updatedData.discount_percent) || 0;
      updatedData.final_amount = (monthlyFee - (monthlyFee * discount / 100)).toFixed(2);
    }
    setFormData(updatedData);
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await updateProgram(editId, formData);
      } else {
        await addProgram(formData);
      }
      setFormModalOpen(false);
      fetchPrograms(page);
    } catch (err) {
      console.error("Failed to save program.");
    }
    setLoading(false);
  };

  const openFormModal = (program = null) => {
    if (program) {
      setFormData(program);
      setEditId(program.id);
      setPreviewImage(program.program_image);
    } else {
      setFormData({
        program_name: "", program_desc: "", program_image: null,
        age_group: "", monthly_fee: "", discount_percent: "", final_amount: ""
      });
      setEditId(null);
      setPreviewImage(null);
    }
    setFormModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    await deleteProgram(selectedRow.id);
    setDeleteModalOpen(false);
    setLoading(false);
    fetchPrograms(page);
  };

  // Handle Image Upload
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "image") {
        setFormData({ ...formData, program_image: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (type === "banner") {
        setFormData({ ...formData, program_banner: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewBanner(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Programs</h5>
        <div>
          <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Program
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        programs.length > 0 ? (
          <TableContainer component={Paper} className="scoll_dev">
            <Table stickyHeader aria-label="customized sticky table simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Program Name</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell width={100}>Age</TableCell>
                  <TableCell>Fees</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Final Amount</TableCell>
                  <TableCell width={100} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {programs.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.program_name}</TableCell>
                    <TableCell>{row.program_image && <img src={`${IMAGE_BASE_URL}${row.program_image}`} alt={row.program_name} width="40" height="40" />}</TableCell>
                    <TableCell>{row.program_desc}</TableCell>
                    <TableCell>{row.age_group} Yrs</TableCell>
                    <TableCell width={85}><CurrencyRupeeIcon className="fs-14 text-black" />{row.monthly_fee}</TableCell>
                    <TableCell>{row.discount_percent}</TableCell>
                    <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{row.final_amount}</TableCell>
                    <TableCell align="center">
                    <DropdownButton
                        align="end"
                        title={<Menu />}
                        size='sm'
                        className="custom_dropdown"
                      >
                        <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(row)}>Edit</Dropdown.Item>
                        <Dropdown.Item className="text-danger fs-14" size="small"  onClick={() => setSelectedRow(row) || setDeleteModalOpen(true)}>Delete</Dropdown.Item>
                      </DropdownButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              className="custom_pagination"
              component="div"
              count={totalPages * rowsPerPage}
              page={page - 1}
              onPageChange={(event, newPage) => setPage(newPage + 1)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            />
          </TableContainer>
        ) : (
          <Typography variant="body1" align="center">No Data Available</Typography>
        )
      )}


      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper',
          boxShadow: 24, p: 3, borderRadius: 2
        }}>
          <Typography variant="h6" gutterBottom>Confirm Deletion</Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete <b>{selectedRow?.program_name}</b>?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
          <Typography variant="h6"  className="custom_heading_modal" gutterBottom>{selectedRow ? 'Edit Program' : 'Create Program'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Program Name" name="program_name" value={formData.program_name} onChange={handleChange} fullWidth />
              <TextField size='small' label="Programs Age" name="age_group" value={formData.age_group} onChange={handleChange} fullWidth />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Program Fee" name="monthly_fee" value={formData.monthly_fee} onChange={handleChange} fullWidth />
              <TextField size='small' label="Discount" name="discount_percent" value={formData.discount_percent} onChange={handleChange} fullWidth />
            </Box>
            <TextField size='small' multiline rows={2} label="Programs Description" name="program_desc" value={formData.program_desc} onChange={handleChange} fullWidth />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <div>
                <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={(e) => handleImageChange(e, "image")} />
                <div className="form-text fs-10">&#128712; Programs Small Image</div>
                {previewImage && <img src={previewImage} alt="Preview" width="100" height="100" />}
              </div>
              <div>
                <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={(e) => handleImageChange(e, "banner")} />
                <div className="form-text fs-10">&#128712; Program Banner Image</div>
                {previewBanner && <img src={previewBanner} alt="Preview" width="100" height="100" />}
              </div>
            </Box>
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
              {selectedRow ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar Alert */}
      <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
    </>
  );
}

export default Programs;
