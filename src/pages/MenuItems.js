import React, { useState, useEffect, useCallback } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper, Modal, Box, Typography,
    FormControlLabel, Autocomplete, TextField, Checkbox
} from "@mui/material";
import { Col, Row, Button } from "react-bootstrap";
import { getAllChildren } from "../services/childApi";
import { getCafeteriaItems, purchaseItem } from "../services/cafeteriaApi";
import { IMAGE_BASE_URL } from "../config/constants";
import Child from '../assets/images/child.png';
import { CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";
import AlertMessage from "../includes/AlertMessage";
import { handleApiError } from "../utils/apiErrorHandler";
import Spinner from "../includes/Spinner";

const MenuItems = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [childSearchText, setChildSearchText] = useState("");
    const [childData, setChildData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [alertMessage, setAlertMessage] = useState({ open: false, type: "", message: "" });

    // get all children by search
    const fetchChildren = useCallback(async () => {
        try {
            const response = await getAllChildren({ search: childSearchText });
            setChildData(response.data || []);
        } catch (err) {
            console.error("Failed to fetch child data.");
        }
    }, [childSearchText]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (childSearchText) fetchChildren();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [childSearchText, fetchChildren]);

    // get all cafeteria
    const fetchCafeteriaItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCafeteriaItems();
            console.log("items,", response);
            setMenuItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch cafeteria items:", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCafeteriaItems();
    }, []);

    const handleQuantityChange = (item, increment) => {
        setSelectedItems((prevSelected) => {
            const existingItem = prevSelected.find((selected) => selected.id === item.id);
            if (existingItem) {
                const updatedQuantity = existingItem.quantity + increment;
                if (updatedQuantity <= 0) {
                    setMenuItems((prev) =>
                        prev.map((m) =>
                            m.id === item.id ? { ...m, stock: m.stock + existingItem.quantity } : m
                        )
                    );
                    return prevSelected.filter((selected) => selected.id !== item.id);
                }
                setMenuItems((prev) =>
                    prev.map((m) => (m.id === item.id ? { ...m, stock: m.stock - increment } : m))
                );
                return prevSelected.map((selected) =>
                    selected.id === item.id ? { ...selected, quantity: updatedQuantity } : selected
                );
            } else if (increment > 0 && item.stock > 0) {
                setMenuItems((prev) =>
                    prev.map((m) => (m.id === item.id ? { ...m, stock: m.stock - 1 } : m))
                );
                return [...prevSelected, { ...item, quantity: 1 }];
            }
            return prevSelected;
        });
    };

    const calculateTotal = useCallback(() => {
        return selectedItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    }, [selectedItems]);

    useEffect(() => {
        if (calculateTotal() >= 500) setShowModal(true);
        else setShowModal(false);
    }, [calculateTotal]);

    const handleApproveItems = async () => {
        if (calculateTotal() < 500) {
            try {
                setLoading(true);
                const formData = {
                    child_code: selectedChild?.code,
                    amount: calculateTotal(),
                    items: selectedItems.map((item) => ({
                        cafeteria_item_id: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                };
                await purchaseItem(formData);
                setAlertMessage({ open: true, type: "success", message: "Purchase successful!" });
                setLoading(false);
                fetchCafeteriaItems();
                setSelectedItems([]);
                setSelectedChild(null);
            } catch (error) {
                handleApiError(error, setAlertMessage);
            }
        } else {
            setShowModal(true);
        }
    };

    console.log("Selected Child:", selectedChild);

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <Autocomplete
                    options={childData}
                    getOptionLabel={(option) => `${option.child_name || ''} (${option.code || ''})`}
                    filterOptions={(options, state) =>
                        options.filter(option =>
                            option.child_name?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                            option.code?.toLowerCase().includes(state.inputValue.toLowerCase())
                        )
                    }
                    value={selectedChild}
                    onInputChange={(e, newInput) => setChildSearchText(newInput)}
                    onChange={(e, newVal) => setSelectedChild(newVal)}
                    loading={loading}
                    sx={{ width: 300 }}
                    renderOption={(props, option) => (
                        <li {...props} className="d-flex align-items-center p-2 border-bottom text-capitalize">
                            <img
                                src={option?.profile_pic_url ? `${IMAGE_BASE_URL}${option.profile_pic_url}` : Child}
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
                    {loading ? <Spinner loading={loading} /> : (
                        menuItems.length > 0 ? (
                            <>
                                <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Menu Items</TableCell>
                                                <TableCell align="center">Stock</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {menuItems.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="text-capitalize"><img src={`${IMAGE_BASE_URL}${item.image}`} width={35} className="rounded-1 border border-2 me-1" height={35} alt={item.name} /> {item.name}</TableCell>
                                                    <TableCell align="center">{item.stock > 0 ? <span className="text-success fw-600">{item.stock}</span> : <span className=" bg-danger bg-opacity-25 text-danger p-1 rounded-1 fs-10">Out Of Stock</span>}</TableCell>
                                                    <TableCell><CurrencyRupeeIcon className="fs-14 text-black" />{item.price}</TableCell>
                                                    <TableCell>
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-secondary bg-opacity-25 border-2 border rounded-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant="danger"
                                                                    className="px-2 py-1 rounded-0"
                                                                    onClick={() => handleQuantityChange(item, -1)}
                                                                    disabled={!selectedItems.find((selected) => selected.id === item.id)}
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
                                                                    disabled={item.stock <= 0}
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
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <h5 className="text-danger">No Items Found</h5>
                            </div>
                        ))}
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
                            <img src={Child} width={150} height={150} alt="child" className="canteenKid" />
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

            {/* Snackbar Alert */}
            <AlertMessage alertMessage={alertMessage} setAlertMessage={setAlertMessage} />
        </div>
    );
};

export default MenuItems;