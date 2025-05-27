import React, { useEffect, useState } from "react";
import { getAllSkillLevels, addSkillLevels, updateSkillLevels, deleteSkillLevel } from "../services/skillLevelApi";
import { getDropDownPrograms } from "../services/programsApi";
import { getSubProgramFocus } from "../services/subprogramsApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, FormControl,
  Button, Modal, Box, Typography, TextField, Select, MenuItem, TablePagination, InputAdornment
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon, Close as CloseIcon, MoreVert as Menu, CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";
import { Link } from "react-router";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import useDebounce from "../hooks/useDebounce";
import { handleApiError } from "../utils/apiErrorHandler";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import NoData from "../includes/NoData";
import ExportCSVButton from "../pages/ExportCSVButton";

const ProgramSkill = () => {
  const [skillLevels, setSkillLevels] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [subFocus, setSubFocus] = useState([]);
  const [formData, setFormData] = useState({ program_id: "", focus_id: "", skills: [] });
  const [editId, setEditId] = useState(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchSkillLevels();
    fetchPrograms();
  }, [page, rowsPerPage, debouncedSearch]);

  const fetchSkillLevels = async () => {
    setLoading(true);
    try {
      const response = await getAllSkillLevels({ page: page + 1, per_page: rowsPerPage, search: debouncedSearch });
      setSkillLevels(response.data || []);
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
      setFormData({
        program_id: row.program_id,
        skills: [{
          program_id: row.program_id,
          focus_id: row.focus_id,
          skill_name: row.skill_name,
          skill_description: row.skill_description,
          skill_period: row.skill_period,
          skill_amount: row.skill_amount,
          skill_discount: row.skill_discount,
        }]
      });
      setEditId(row.id);
    } else {
      setFormData({ program_id: "", focus_id: "", skills: [{ skill_name: "", skill_description: "", skill_period: "", skill_amount: "", skill_discount: 0 }] });
      setEditId(null);
    }
    setFormModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteSkillLevel(selectedRow.id);
      setAlertMessage({ open: true, type: "success", message: "Skill deleted successfully!" });
      fetchSkillLevels();
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setDeleteModalOpen(false);
    setLoading(false);

  };

  // Handle Input Change in Form
  const handleChange = (index, field, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index][field] = value;
    updatedSkills[index].program_id = formData.program_id;
    updatedSkills[index].focus_id = formData.focus_id;
    setFormData({ ...formData, skills: updatedSkills });
  };

  // Handle Create/Edit Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editId) {
        await updateSkillLevels(editId, formData.skills[0]);
        setAlertMessage({ open: true, type: "success", message: "Skill updated successfully!" });
      } else {
        const updatedSkills = formData.skills.map(skill => ({ ...skill, program_id: formData.program_id, focus_id: formData.focus_id }));
        await addSkillLevels({ skills: updatedSkills });
        setAlertMessage({ open: true, type: "success", message: "Program Created successfully!" });
      }
      setFormModalOpen(false);
      fetchSkillLevels(page);
    } catch (err) {
      handleApiError(err, setAlertMessage);
    }
    setLoading(false);
  };

  // Add a Row
  const handleAddRow = () => {
    setFormData({ ...formData, skills: [...formData.skills, { program_id: formData.program_id, focus_id: formData.focus_id, skill_name: "", skill_description: "", skill_period: "", skill_amount: "", skill_discount: "" }] });
  };

  // Delete a Row
  const handleRemoveRow = (index) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({ ...formData, skills: updatedSkills });
  };


  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Skill Level</h5>

        <div className="d-flex justify-content-between gap-2">
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
          <Button size="small" variant="contained" color="success" startIcon={<AddIcon />} onClick={() => openFormModal()}>
            Create Skill Level
          </Button>
          {/* <ExportCSVButton
            fetchAllData={async () => {
              const response = await getAllSkillLevels({ page: 1, per_page: 10000, search: debouncedSearch });
              return response.data || [];
            }}
            headers={[
              "Program",
              "Sub Program",
              "Skill Name",
              "Period"
            ]}
            rowMapper={row => [
              row.program?.program_name || "",
              row.sub_program_focus?.title || "",
              row.skill_name || "",
              row.skill_period + ' Months' || ""
            ]}
            fileName="Pogram Skill.csv"
            onError={() => setAlertMessage({ open: true, type: "error", message: "Failed to fetch all Program Skill for export." })}
          /> */}
        </div>
      </div>

      {loading ? <Spinner loading={loading} /> : (
        skillLevels.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell>Sub Program</TableCell>
                  <TableCell>Skill Name</TableCell>
                  {/* <TableCell>Description</TableCell> */}
                  <TableCell>Period</TableCell>
                  {/* <TableCell>Amount</TableCell>
                  <TableCell>Discount</TableCell> */}
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skillLevels.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.program?.program_name}</TableCell>
                    <TableCell>{row.sub_program_focus?.title}</TableCell>
                    <TableCell>{row.skill_name}</TableCell>
                    {/* <TableCell>{row.skill_description}</TableCell> */}
                    <TableCell>{row.skill_period} Months</TableCell>
                    {/* <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{row.skill_amount}</TableCell>
                    <TableCell>{row.skill_discount}</TableCell> */}
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
              rowsPerPage={rowsPerPage}
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
          <Typography variant="body1" gutterBottom sx={{ mb: 3 }}>
            Are you sure you want to delete <b>{selectedRow?.skill_name}</b>?
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
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>{editId ? 'Edit Skill' : 'Create Skill'}</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
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
            {formData.skills.map((skill, index) => (
              <Box component="form" key={`skill-${index}`} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <Box className='d-flex' sx={{ gap: 2 }}>
                  <TextField size="small" label="Skill Name" value={skill.skill_name} onChange={(e) => handleChange(index, "skill_name", e.target.value)} fullWidth required />
                  <TextField size="small" label="Period" value={skill.skill_period} onChange={(e) => handleChange(index, "skill_period", e.target.value)} fullWidth required />
                  {/* <TextField size="small" label="Amount" type="number" value={skill.skill_amount} onChange={(e) => handleChange(index, "skill_amount", e.target.value)} fullWidth disabled />
                  <TextField size="small" label="Discount" type="number" value={skill.skill_discount} onChange={(e) => handleChange(index, "skill_discount", e.target.value)} fullWidth disabled /> */}
                </Box>
                {/* <TextField size="small" label="Description" multiline rows={2} value={skill.skill_description} onChange={(e) => handleChange(index, "skill_description", e.target.value)} fullWidth required /> */}
                <div>
                  <ReactQuill theme="snow" value={skill.skill_description} style={{ height: '50px' }} onChange={(value) => handleChange(index, "skill_description", value)} />
                </div>
                <div className="text-end mt-4">
                  {!editId && (<Link color="error" className="text-danger rounded-5" onClick={() => handleRemoveRow(index)}>
                    <CloseIcon />
                  </Link>
                  )}
                </div>
              </Box>
            ))}
            {!editId && (
              <Button onClick={handleAddRow} variant="contained" size="small" color="success" startIcon={<AddIcon />}>Add Row</Button>
            )}
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button onClick={() => setFormModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
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

export default ProgramSkill;
