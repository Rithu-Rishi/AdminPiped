import React, { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, Checkbox, Modal, Box, Typography,
    FormControlLabel,
    TextField,
    InputAdornment
} from "@mui/material";
import { Col, Row, Button } from "react-bootstrap";
import ara from '../assets/images/aria.webp'
import { Search as SearchIcon} from "@mui/icons-material";

const MenuItems = () => {
    const menuItems = [
        { id: 1, name: "Samosa", price: 50 },
        { id: 2, name: "Cheese cake", price: 50 },
        { id: 3, name: "Coke", price: 50 },
        { id: 4, name: "Fanta", price: 50 },
        { id: 5, name: "Pizza", price: 50 },
        { id: 6, name: "Chat", price: 50 },
        { id: 7, name: "Sprite", price: 50 },
        { id: 8, name: "Bun", price: 50 },
        { id: 9, name: "Rice", price: 50 },
        { id: 10, name: "Sprite", price: 50 },
        { id: 11, name: "Bun", price: 50 },
        { id: 12, name: "Rice", price: 50 },
    ];

    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleCheckboxChange = (item) => {
        setSelectedItems((prevSelected) => {
            if (prevSelected.some((selected) => selected.id === item.id)) {
                // Remove item if already selected
                return prevSelected.filter((selected) => selected.id !== item.id);
            } else {
                // Add item if not already selected
                return [...prevSelected, item];
            }
        });
    };

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + item.price, 0);
    };

    useEffect(() => {
        if (calculateTotal() >= 500) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [selectedItems]);

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
               <TextField className="search_icon"
                         size="small"
                         placeholder="Search..."
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <SearchIcon className="fs-14 text-primary" />
                             </InputAdornment>
                           ),
                         }}
                       />
            </div>
            <Row className="align-items-center">
                <Col md='7'>
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Menu Items</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Selection</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menuItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell>
                                            <Checkbox
                                                color="success"
                                                className="p-0"
                                                checked={selectedItems.some((selected) => selected.id === item.id)}
                                                onChange={() => handleCheckboxChange(item)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div style={{ position: "sticky", bottom: 0, background: "#e4e4e4", zIndex: 1 }}>
                            <Table>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell className="fw-600 text-dark" width={205}>Total Amount:</TableCell>
                                        <TableCell className="fw-600 text-dark">{calculateTotal()}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </TableContainer>
                    <Button size="sm" variant="danger" className="mt-2 rounded-0">Approve Items</Button>
                </Col>
                <Col md="2" className="text-center">
                    <Button size="sm" variant="danger" className="mt-2 rounded-0 px-4 mb-3">ADD</Button>
                    <div>
                        <div className="bg-danger d-inline-block">
                            <Button size="sm" variant="danger" className="px-2 py-1">-</Button>
                            <span className="mx-2">1</span>
                            <Button size="sm" variant="danger" className="px-2 py-1">+</Button>
                        </div>
                    </div>
                </Col>
                <Col md="3" className="text-center">
                    <img src={ara} alt="user" width={200} className="canteenKid" />
                    <br />
                    <FormControlLabel control={<Checkbox defaultChecked color="success" required/>} label="Kid Verified" />
                    <p>* Manditory to check filed</p>
                </Col>
            </Row>

            {/* Modal Popup */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="bg-danger" sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 2,
                    borderRadius: 2,
                    textAlign: 'center',
                    
                }}>
                    
                    <Typography id="modal-description" className="text-white">
                    Unable to approve items- Daily Budget (500)
                    reached, come back tomorrow
                    </Typography>                    
                </Box>
            </Modal>
        </div>
    );
};

export default MenuItems;