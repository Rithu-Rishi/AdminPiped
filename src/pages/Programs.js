import React, { useEffect, useState } from "react";
import { getAllPrograms, addProgram, updateProgram, deleteProgram } from "../services/programsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, Box, Typography, TextField, InputAdornment, TablePagination
} from "@mui/material";
import { IMAGE_BASE_URL } from "../config/constants";
import { Add as AddIcon, MoreVert as Menu, CurrencyRupee as CurrencyRupeeIcon, Search as SearchIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import NoData from "../includes/NoData";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    program_name: "", program_desc: "", program_image: null, program_banner: null,
    age_group: "", monthly_fee: "", discount_percent: 0.00, final_amount: ""
  });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [existingImages, setExistingImages] = useState({ image: null, banner: null });
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchPrograms();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await getAllPrograms({
        page: page + 1, per_page: rowsPerPage, search: debouncedSearch
      });
      setPrograms(response.data || []);
      setTotalCount(response.total || 0);
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
    const { program_name, program_desc, age_group, monthly_fee, discount_percent } = formData;
    if (!program_name || !program_desc || !age_group || !monthly_fee || discount_percent === "") {
      setAlertMessage({ open: true, type: "error", message: "All fields are required." });
      return;
    }

    const updatedForm = { ...formData };

    if (editId) {
      if (formData.program_image === existingImages.image) delete updatedForm.program_image;
      if (formData.program_banner === existingImages.banner) delete updatedForm.program_banner;
    }

    setLoading(true);
    try {
      if (editId) {
        await updateProgram(editId, updatedForm);
        setAlertMessage({ open: true, type: "success", message: "Program updated successfully!" });
      } else {
        await addProgram(formData);
        setAlertMessage({ open: true, type: "success", message: "Program created successfully!" });
      }
      setFormModalOpen(false);
      fetchPrograms(page);
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };

  const openFormModal = (program = null) => {
    if (program) {
      setFormData(program);
      setEditId(program.id);
      setPreviewImage(`${IMAGE_BASE_URL}${program.program_image}`);
      setPreviewBanner(`${IMAGE_BASE_URL}${program.program_banner}`);
      setExistingImages({ image: program.program_image, banner: program.program_banner });
    } else {
      setFormData({
        program_name: "", program_desc: "", program_image: null, program_banner: null,
        age_group: "", monthly_fee: "", discount_percent: 0.00, final_amount: ""
      });
      setEditId(null);
      setPreviewImage(null);
      setPreviewBanner(null);
      setExistingImages({ image: null, banner: null });
    }
    setFormModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProgram(selectedRow.id);
      setAlertMessage({ open: true, type: "success", message: "Program deleted successfully!" });
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setDeleteModalOpen(false);
    setLoading(false);
    fetchPrograms(page);
  };

  // Handle Image Upload
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "image") {
        setFormData(prev => ({ ...prev, program_image: file }));
        setPreviewImage(reader.result);
      } else {
        setFormData(prev => ({ ...prev, program_banner: file }));
        setPreviewBanner(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Programs</h5>

        <div className='d-flex align-items-center gap-2'>
          <TextField className="search_icon"
            size="small" placeholder="Search..." value={searchTerm} onChange={(e) => {
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
            Create Program
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        programs.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="table simple table">
              <TableHead>
                <TableRow>
                  <TableCell width={170}>Program Name</TableCell>
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
                    <TableCell><div className="d-flex align-items-center"></div>
                      {row.program_image && <img src={`${IMAGE_BASE_URL}${row.program_image}`} alt={row.program_name} className="border border-2 rounded-1 p-1 me-1" width="40" height="40" />}
                      <span>{row.program_name}</span>
                    </TableCell>
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
                        <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => setSelectedRow(row) || setDeleteModalOpen(true)}>Delete</Dropdown.Item>
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
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
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
            Are you sure you want to delete <b>{selectedRow?.program_name}</b>?
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
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Program' : 'Create Program'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Program Name *" name="program_name" value={formData.program_name} onChange={handleChange} fullWidth />
              <TextField size='small' label="Program Age *" name="age_group" value={formData.age_group} onChange={handleChange} fullWidth />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size='small' label="Program Fee *" name="monthly_fee" value={formData.monthly_fee} onChange={handleChange} fullWidth />
              <TextField size='small' label="Discount *" name="discount_percent" value={formData.discount_percent} onChange={handleChange} fullWidth />
            </Box>
            <TextField size='small' multiline rows={2} label="Programs Description *" name="program_desc" value={formData.program_desc} onChange={handleChange} fullWidth />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <div>
                <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={(e) => handleImageChange(e, "image")} />
                <div className="form-text text-warning fs-10">&#128712; Program Icon Image * (Only below 2MB size)</div>
                {previewImage && <img src={previewImage} alt="Preview" width="100" height="100" />}
              </div>
              <div>
                <input type="file" className="border rounded-2 w-100 p-2" accept="image/*" onChange={(e) => handleImageChange(e, "banner")} />
                <div className="form-text text-warning fs-10">&#128712; Program Banner Image * (Only below 2MB size)</div>
                {previewBanner && <img src={previewBanner} alt="Preview" width="100" height="100" />}
              </div>
            </Box>
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
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

export default Programs;
