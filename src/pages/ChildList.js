import React, { useEffect, useState } from "react";
import { getAllChildren, addChild, updateChild, deleteChild } from "../services/childApi";
import { getAllParents } from "../services/parentApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, InputAdornment
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IMAGE_BASE_URL } from "../config/constants";
import { Search as SearchIcon, MoreVert as Menu } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { formatDate } from '../utils/dateUtils';
import Child from '../assets/images/child.png';
import useDebounce from "../hooks/useDebounce";
import NoData from "../includes/NoData";

const ChildList = () => {
  const [children, setChildren] = useState([]);
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    parent_id: "",
    child_name: "",
    gender: "",
    date_of_birth: "",
    profile_image: null
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchChildren();
  }, [page, rowsPerPage, debouncedSearch]);

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await getAllChildren({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      setChildren(response.data || []);
      setTotalCount(response.total || 0);
    } catch (err) {
      console.error("Failed to fetch children.");
    }
    setLoading(false);
  };

  const fetchParents = async () => {
    try {
      const response = await getAllParents();
      setParents(response.data || []);
    } catch (err) {
      console.error("Failed to fetch parents.");
    }
  };

  // Handle Open Modals
  const openDeleteModal = (row) => {
    setSelectedChild(row);
    setDeleteModalOpen(true);
  };

  const openFormModal = (child = null) => {
    if (child) {
      setFormData({
        parent_id: child.parent_id ? String(child.parent_id) : "", // Ensure it's a string for Select
        child_name: child.child_name || "",
        gender: child.gender ? String(child.gender) : "", // Ensure it's a string for Select
        date_of_birth: child.date_of_birth ? new Date(child.date_of_birth) : null,
        profile_image: null
      });
      setPreviewImage(child.profile_image);
      setEditId(child.id);
    } else {
      setFormData({ parent_id: "", child_name: "", gender: "", date_of_birth: "", profile_image: null });
      setPreviewImage(null);
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    setLoading(true);
    if (!selectedChild) return;
    try {
      await deleteChild(selectedChild.id);
      setDeleteModalOpen(false);
      fetchChildren();
    } catch (err) {
      console.error("Failed to delete child.");
    }
    setLoading(false);
  };

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
        await updateChild(editId, formData);
      } else {
        await addChild(formData);
      }
      setFormModalOpen(false);
      fetchChildren();
    } catch (err) {
      console.error("Failed to save child.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Child List</h5>
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
            Create Child
          </Button>
        </div> */}
      </div>

      {loading ? <Spinner loading={loading} /> : (
        children.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Child Name</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Date of Birth</TableCell>
                  <TableCell>Subscription</TableCell>
                  {/* <TableCell align="center">Actions</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {children.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell><img src={row.profile_pic_url ? `${IMAGE_BASE_URL}${row.profile_pic_url}` : Child} alt={row.child_name} className="border border-2 rounded-1 p-1 me-1" width="40" height="40" />{row.child_name}</TableCell>
                    <TableCell>{row.user.name}</TableCell>
                    <TableCell><span className={`px-3 py-1 rounded-1 bg-opacity-10 ${row.gender === 'Male' ? 'bg-success text-success' : 'bg-danger text-danger'}`}>{row.gender}</span></TableCell>
                    <TableCell>{formatDate(row.date_of_birth)}</TableCell>
                    <TableCell>
                      {row.facility_subscription?.length > 0 ? (() => {
                        const endDate = new Date(row.facility_subscription[0].end_date);
                        const isExpired = endDate < new Date();

                        return (
                          <span className={isExpired ? "text-danger fw-bold" : "text-success fw-bold"}>
                            {formatDate(row.facility_subscription[0].end_date)}
                            {isExpired ? " (Expired)" : ""}
                          </span>
                        );
                      })() : (
                        <span className="text-muted">No Subscription</span>
                      )}
                    </TableCell>
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
          <Typography variant="h6" gutterBottom color="error">Confirm Deletion</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>Are you sure you want to delete {selectedChild?.child_name}?</Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
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
          <Typography variant="h6" className="custom_heading_modal">{editId ? "Edit Child" : "Add Child"}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Select size="small" fullWidth name="parent_id" value={formData.parent_id} onChange={handleChange}>
                {parents.map((parent) => (
                  <MenuItem key={parent.id} value={parent.id}>{parent.name}</MenuItem>
                ))}
              </Select>
              <TextField size="small" label="Child Name" name="child_name" value={formData.child_name} onChange={handleChange} fullWidth />

            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Select size="small" fullWidth name="gender" value={formData.gender} onChange={handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {/* <TextField size="small" label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} fullWidth /> */}
              <DatePicker
                selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                onChange={(date) =>
                  setFormData({
                    ...formData,
                    date_of_birth: date ? date.toISOString().split("T")[0] : "",
                  })
                }
                dateFormat="dd MMM, yyyy"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                className="form-control"
                placeholderText="Date of Birth"
              />
            </Box>
            <input type="file" className="border p-2 rounded-2 w-100" accept="image/*" onChange={handleFileChange} />
            {previewImage && <img src={previewImage} alt="Profile Preview" width="100" height="100" style={{ marginTop: 10 }} />}
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editId ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar Alert */}
      <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
    </>
  );
}

export default ChildList;
