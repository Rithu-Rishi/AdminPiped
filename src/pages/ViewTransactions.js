import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TableFooter, Paper, TextField, Autocomplete, Typography
} from "@mui/material";
import { CurrencyRupee as CurrencyRupeeIcon } from "@mui/icons-material";
import { getAllChildren } from "../services/childApi";
import { getCafeteriaTransactions } from "../services/cafeteriaApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "../includes/Spinner";
import { formatDate } from "../utils/dateUtils";
import NoData from "../includes/NoData";

const ViewTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [childSearchText, setChildSearchText] = useState("");
    const [childData, setChildData] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, [date, selectedChild]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const payload = {
                date: date.toISOString().split("T")[0],
                child_id: selectedChild?.id || null
            };
            const response = await getCafeteriaTransactions(payload);
            setTransactions(response.data || []);
        } catch (err) {
            console.error("Failed to fetch transactions");
        }
        setLoading(false);
    };

    const fetchChildren = async () => {
        try {
            const response = await getAllChildren({ search: childSearchText });
            setChildData(response.data || []);
        } catch (err) {
            console.error("Failed to fetch children");
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (childSearchText) fetchChildren();
        }, 300);
        return () => clearTimeout(delay);
    }, [childSearchText]);

    const totalSales = transactions.reduce((acc, trx) => acc + parseFloat(trx.total_amount), 0);
    const totalOrders = transactions.length;

    const formatDateTime = (datetimeStr) => {
        const date = new Date(datetimeStr);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5>View Transactions</h5>
                <div className='d-flex gap-2'>
                    <DatePicker
                        selected={date}
                        onChange={(val) => setDate(val)}
                        dateFormat="dd MMM, yyyy"
                        className="form-control"
                        maxDate={new Date()}
                    />
                    <Autocomplete
                        options={childData}
                        getOptionLabel={(option) => `${option.child_name || ''} (${option.code || ''})`}
                        value={selectedChild}
                        onInputChange={(e, value) => setChildSearchText(value)}
                        onChange={(e, newValue) => setSelectedChild(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} size="small" placeholder="Search Child" />
                        )}
                        sx={{ width: 250 }}
                    />
                </div>
            </div>
            {loading ? <Spinner loading={loading} /> : (
                transactions.length > 0 ? (
                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Child Name</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Order Items</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.child?.name}</TableCell>
                                        <TableCell>{formatDateTime(item.created_at)}</TableCell>
                                        <TableCell>
                                            {item.items.map((itm, idx) => (
                                                <span key={idx}>{itm.item_name} x {itm.quantity}{idx < item.items.length - 1 ? ", " : ""}</span>
                                            ))}
                                        </TableCell>
                                        <TableCell><CurrencyRupeeIcon className="fs-14 text-black" /> {item.total_amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div style={{ position: "sticky", bottom: 0, background: "#e4e4e4", zIndex: 1 }}>
                            <Table>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell className="fw-600 text-dark">Total</TableCell>
                                        <TableCell className="fw-600 text-dark">{totalOrders} Orders</TableCell>
                                        <TableCell colSpan={2} className="fw-600 text-dark">
                                            <CurrencyRupeeIcon className="fs-14 text-black" /> {totalSales.toFixed(2)} Total Sales
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </TableContainer>
                ) : (
                    <NoData />
                )
            )}
        </div>
    );
};

export default ViewTransactions;