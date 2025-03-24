import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Modal, Box, Typography, Switch
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getAllNotices, addNotice, updateNotice, deleteNotice, toggleNoticeStatus
} from "../services/noticeApi";
import { Add as AddIcon, MoreVert as Menu } from "@mui/icons-material";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AlertMessage from "../includes/AlertMessage";
import Spinner from "../includes/Spinner";
import { handleApiError } from "../utils/apiErrorHandler";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({
    notice_text: "", is_active: true
  });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await getAllNotices();
      setNotices(response.notices || []);
    } catch (err) {
      console.error("Failed to fetch notices.");
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await updateNotice(editId, formData);
        setAlertMessage({ open: true, type: "success", message: "Notice updated successfully!" });
      } else {
        await addNotice(formData);
        setAlertMessage({ open: true, type: "success", message: "Notice created successfully!" });
      }
      setFormModalOpen(false);
      fetchNotices();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleNoticeStatus(id);
      setAlertMessage({ open: true, type: "success", message: "Status updated successfully!", });
      fetchNotices();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
  };

  const openFormModal = (row = null) => {
    if (row) {
      setFormData({
        notice_text: row.notice_text || "",
        is_active: row.is_active || true
      });
      setEditId(row.id);
    } else {
      setFormData({ notice_text: "", is_active: true });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteNotice(selectedRow.id);
      setAlertMessage({ open: true, type: "success", message: "Notice deleted successfully!" });
      fetchNotices();
      setDeleteModalOpen(false);
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
  };

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Notice Board</h5>
        <div>
          <Button size="small" variant="contained" color="success" onClick={() => openFormModal()} startIcon={<AddIcon />}>
            Add Notice Board
          </Button>
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        notices.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label=" simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Text</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell dangerouslySetInnerHTML={{
                      __html: row.notice_text?.length > 200
                        ? row.notice_text.slice(0, 200) + "..."
                        : row.notice_text,
                    }}></TableCell>
                    <TableCell>
                      <Switch checked={row.is_active} onChange={() => handleToggleStatus(row.id)} />
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
            Are you sure you want to delete notice?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button onClick={() => setDeleteModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
      </Modal>

      {/* Add/Edit Workshop Modal */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}
        aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
      >
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Notice' : 'Create Notice'}</Typography>
          <Box className="modal_body bg-white p-3" sx={{height:300}} component="form">
            <ReactQuill theme="snow" value={formData.notice_text} style={{ height: '230px' }} onChange={(value) => setFormData({ ...formData, notice_text: value })} />
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

export default NoticeBoard;
