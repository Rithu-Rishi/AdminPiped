import React, { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, Modal, Box, Typography,
    FormControlLabel,
    Autocomplete,
    TextField,
    InputAdornment, Checkbox
} from "@mui/material";
import { Col, Row, Button } from "react-bootstrap";
import { Search as SearchIcon } from "@mui/icons-material";
import { getAllChildren } from "../services/childApi";
import { IMAGE_BASE_URL } from "../config/constants";
import Child from '../assets/images/child.png';
import { CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";

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
    const [searchValue, setSearchValue] = useState("");
    const [childData, setChildData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);

    // Fetch child data from the API
    const fetchChildren = async (search) => {
        setLoading(true);
        try {
            const response = await getAllChildren({ search });
            console.log(response)
            setChildData(response.data || []);
        } catch (err) {
            console.error("Failed to fetch child data.");
        }
        setLoading(false);
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchValue) {
                fetchChildren(searchValue);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchValue]);

    const handleQuantityChange = (item, increment) => {
        setSelectedItems((prevSelected) => {
            const existingItem = prevSelected.find((selected) => selected.id === item.id);
            if (existingItem) {
                const updatedQuantity = existingItem.quantity + increment;
                if (updatedQuantity <= 0) {
                    return prevSelected.filter((selected) => selected.id !== item.id);
                }
                return prevSelected.map((selected) =>
                    selected.id === item.id ? { ...selected, quantity: updatedQuantity } : selected
                );
            } else if (increment > 0) {
                return [...prevSelected, { ...item, quantity: 1 }];
            }
            return prevSelected;
        });
    };

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    useEffect(() => {
        if (calculateTotal() >= 500) {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    }, [selectedItems]);

    const handleApproveItems = () => {
        if (calculateTotal() < 500) {
            // Submit the form logic here
            alert("Form submitted successfully!");
        } else {
            setShowModal(true);
        }
    };

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <Autocomplete
                    options={childData}
                    getOptionLabel={(option) => {
                        if (typeof option === "string") {
                            return option;
                        }
                        return option?.child_name || "No Child";
                    }}
                    value={searchValue}
                    onInputChange={(event, newValue) => setSearchValue(newValue)}
                    onChange={(event, newValue) => setSelectedChild(newValue)}
                    loading={loading}
                    sx={{ width: 300 }}
                    renderOption={(props, option) => (
                        <li {...props} className="d-flex align-items-center p-2 border-bottom text-capitalize">
                            <img
                                src={option?.profile_pic_url ? `${IMAGE_BASE_URL}${option.profile_pic_url}` : Child} // Fallback to default image if profile_pic_url is missing
                                alt={option?.child_name || "No Name"}
                                style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 10 }}
                            />
                            {option?.child_name || "No Child"}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder="Search Children"
                            className="search_icon"
                        />
                    )}
                />
            </div>
            <Row className="align-items-center">
                <Col md='9'>
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Menu Items</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {menuItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-capitalize">{item.name}</TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{item.price}</TableCell>
                                        <TableCell>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-secondary bg-opacity-25 border-2 border rounded-1">
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="px-2 py-1 rounded-0"
                                                        onClick={() => handleQuantityChange(item, -1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="mx-2 quantityBox">
                                                        {selectedItems.find((selected) => selected.id === item.id)?.quantity || 0}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="px-2 py-1 rounded-0"
                                                        onClick={() => handleQuantityChange(item, 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
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
                                        <TableCell className="fw-600 text-dark"><CurrencyRupeeIcon className="fs-14 text-black" />{calculateTotal()}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </TableContainer>
                    <Button size="sm" variant="danger" className="mt-2 rounded-0" disabled={calculateTotal() >= 500} onClick={handleApproveItems}>Approve Items</Button>
                </Col>

                <Col md="3" className="text-center">
                    {selectedChild ? (
                        <div>
                            <img src={selectedChild?.profile_pic_url ? `${IMAGE_BASE_URL}${selectedChild.profile_pic_url}` : Child} alt={selectedChild?.child_name || "No Name"} width={150} height={150} className="canteenKid" />
                            <h5 className="mb-0 mt-2 text-danger text-capitalize"> {selectedChild?.child_name || "No Child"}</h5>
                            <FormControlLabel control={<Checkbox defaultChecked color="success" required />} label="Kid Verified" />
                            <p className="fs-10 mb-0">* Mandatory to check field</p>
                        </div>
                    ) : (
                        <div>
                            <img src={Child} width={150} height={150} className="canteenKid" />
                            <h6 className="text-danger mt-3"> No selected child details</h6>
                        </div>
                    )}
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
                        Unable to approve items - Daily Budget (500) reached, come back tomorrow
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
};

export default MenuItems;