import React, { useEffect, useState } from "react";
import { getAllParents, addParent, updateParent, deleteParent } from "../services/parentApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, Box, Typography, TextField, TablePagination, InputAdornment, Tooltip
} from "@mui/material";
import { IMAGE_BASE_URL } from "../config/constants";
import { Search as SearchIcon, MoreVert as Menu, CheckCircleOutline as CheckCircleOutlineIcon, ErrorOutlineOutlined as ErrorOutlineOutlinedIcon } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { formatDate } from '../utils/dateUtils';
import Parent from '../assets/images/parents-64.png';
import NoData from "../includes/NoData";

const ParentsList = () => {
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    date_of_birth: "",
    profile_image: null
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchParents();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchParents = async () => {
    setLoading(true);
    try {
      const response = await getAllParents({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      setParents(response.data || []);
      setTotalCount(response.total || 0);
    } catch (err) {
      console.error("Failed to fetch parents.");
    }
    setLoading(false);
  };

  // const openFormModal = (parent = null) => {
  //   if (parent) {
  //     setFormData({
  //       name: parent.name || "",
  //       email: parent.email || "",
  //       mobile_number: parent.mobile_number || "",
  //       date_of_birth: parent.date_of_birth || "",
  //       profile_image: null
  //     });
  //     setPreviewImage(parent.profile_image);
  //     setEditId(parent.user_id);
  //   } else {
  //     setFormData({ name: "", email: "", mobile_number: "", date_of_birth: "", profile_image: null });
  //     setPreviewImage(null);
  //     setEditId(null);
  //   }
  //   setFormModalOpen(true);
  // };

  // Handle Input Change in Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profile_image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await updateParent(editId, formData);
      } else {
        await addParent(formData);
      }
      setFormModalOpen(false);
      fetchParents();
    } catch (err) {
      console.error("Failed to save parent.");
    }
    setLoading(false);
  };

  const openDeleteModal = (parent) => {
    setSelectedParent(parent);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!selectedParent) return;
    try {
      await deleteParent(selectedParent.id);
      setDeleteModalOpen(false);
      fetchParents();
    } catch (err) {
      console.error("Failed to delete parent.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Parents List</h5>
        <TextField className="search_icon"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
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
        {/* <div>
          <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Parent
          </Button>
        </div> */}
      </div>

      {loading ? <Spinner loading={loading} /> : (
        parents.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell># Child</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>DOB</TableCell>
                  {/* <TableCell align="center">Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {parents.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell><img src={row.profile_pic_url ? `${IMAGE_BASE_URL}${row.profile_pic_url}` : Parent} alt="Profile" className="border border-2 rounded-1 p-1 me-1" width="40" height="40" />{row.name}</TableCell>
                    <TableCell><span className="px-2 py-1 rounded-1 bg-opacity-10 bg-success text-success">{row.child_count}</span></TableCell>
                    <TableCell>
                      {row.email}
                      {row.user.email_verified_at === null ? (
                        <Tooltip title="Email not verified">
                          <span className="text-warning">
                            <ErrorOutlineOutlinedIcon className="w-16 m-1" />
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Email verified">
                          <span className="text-success">
                            <CheckCircleOutlineIcon className="w-16 m-1" />
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>{row.mobile_number || 'N/A'}</TableCell>
                    <TableCell>{formatDate(row.date_of_birth)}</TableCell>
                    {/* <TableCell align="center">
                      <DropdownButton
                        align="end"
                        title={<Menu />}
                        size='sm'
                        className="custom_dropdown"
                      >
                        <Dropdown.Item size="small" className="fs-14" onClick={() => openFormModal(row)}>Edit</Dropdown.Item>
                        <Dropdown.Item className="text-danger fs-14" size="small" onClick={() => openDeleteModal(row)}>Delete</Dropdown.Item>
                      </DropdownButton>
                    </TableCell> */}
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
        <Box sx={{ p: 4, bgcolor: "background.paper", boxShadow: 24, borderRadius: 2, maxWidth: 400, mx: "auto", mt: 15, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom color="error">
            Confirm Deletion
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Are you sure you want to delete <b>{selectedParent?.name}</b>?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button variant="outlined" color="primary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Parent Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Parent' : 'Create Parent'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size="small" label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth />
              <TextField size="small" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
            </Box>
            <Box className='d-flex' sx={{ gap: 2 }}>
              <TextField size="small" label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} fullWidth />
              <TextField size="small" label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth />
            </Box>
            <input type="file" className="border p-2 rounded-2" accept="image/*" onChange={handleFileChange} />
            {previewImage && <img src={previewImage} alt="Profile Preview" width="100" height="100" style={{ marginTop: 10 }} />}
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

export default ParentsList;
