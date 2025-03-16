import React from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Box, Typography, TextField
} from "@mui/material";
import { Add as AddIcon, MoreVert as Menu } from "@mui/icons-material";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import workshop from '../assets/images/baking-class.webp';
import Modal from '@mui/material/Modal';


const MembershipOffers = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function createData(image, link) {
    return { image, link };
  }

  const rows = [
    createData(workshop, 'https://www.demo.com'),
    createData(workshop, 'https://www.demo.com'),
    createData(workshop, 'https://www.demo.com'),
    createData(workshop, 'https://www.demo.com'),
    createData(workshop, 'https://www.demo.com'),
  ];

  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Membership Offers</h5>
        <div>
          <Button size="small" variant="contained" color="success" onClick={handleOpen} startIcon={<AddIcon />}>
            Add Offers
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table aria-label=" simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Link</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.image}
              >
                <TableCell><img src={row.image} className="border border-1 rounded-2 p-1" width={60} /></TableCell>
                <TableCell>{row.link}</TableCell>

                <TableCell align="center">
                  <DropdownButton
                    align="end"
                    title={<Menu />}
                    size='sm'
                    className="custom_dropdown"
                  >
                    <Dropdown.Item size="small" className="fs-14" onClick={handleOpen} >Edit</Dropdown.Item>
                    <Dropdown.Item className="text-danger fs-14" size="small">Delete</Dropdown.Item>
                  </DropdownButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="custom_modal" sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper',
          boxShadow: 12, borderRadius: 2
        }}>
          <Typography variant="h6" className="custom_heading_modal" gutterBottom>Add Workshop</Typography>
          <Box className="modal_body bg-white p-3" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '80vh', overflowY: 'auto', pt: 1 }}>
            <TextField size='small' label="Link" fullWidth />
            <input size='small' type="file" className="border w-100 rounded-2 p-2" />
          </Box>
          <Box className="modal_footer text-end" sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
            <Button size="small" variant="contained" color="primary">
              Create
            </Button>
          </Box>
        </Box>
      </Modal>

    </>
  );
}

export default MembershipOffers;
