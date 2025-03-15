import React, { useEffect, useState } from "react";
import { getAllPrograms } from "../services/programsApi";
import {
  getAllTeachers, getTeachersToProgram, assignTeachersToProgram, getProgramsWithTeachers,
  removeTeacherFromProgram
} from "../services/teachersApi";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Modal, Box, Typography, Select, MenuItem, TablePagination
} from "@mui/material";
import { Add as AddIcon, DeleteOutline as DeleteOutlineIcon, MoreVert as Menu } from "@mui/icons-material";
import Spinner from "../includes/Spinner";
import AlertMessage from "../includes/AlertMessage";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


const Sliders = () => {
  function createData(sSlider, sCaption, image) {
    return { sSlider, sCaption, image };
  }

  const rows = [
    createData('image', 'Caption', 'image'),
    createData('image', 'Caption', 'image'),
  ];



  return (
    <>
      {/* Table */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <h5 className="mb-0">Assign Teachers</h5>
        <div>
          <Button size="small" variant="contained" color="success" startIcon={<AddIcon />}>
            Assign Teacher
          </Button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Slider Title</TableCell>
              <TableCell>Slider Caption</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.image}

              >
                <TableCell>{row.image}</TableCell>
                <TableCell>{row.sSlider}</TableCell>
                <TableCell>{row.sCaption}</TableCell>

                <TableCell align="center">
                  <DropdownButton
                    align="end"
                    title={<Menu />}
                    size='sm'
                    className="custom_dropdown"
                  >
                    <Dropdown.Item size="small" className="fs-14">Edit</Dropdown.Item>
                    <Dropdown.Item className="text-danger fs-14" size="small">Delete</Dropdown.Item>
                  </DropdownButton>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Sliders;
