import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Paper
} from "@mui/material";
import { CurrencyRupee as CurrencyRupeeIcon, CalendarMonth as CalendarMonthIcon } from "@mui/icons-material";


const ViewTransactions = () => {
    const menuItems = [
        { id: 1, name: "Ravi", tid: "PP105FFDc", price: 50, items: "Pizza x 1" },
        { id: 2, name: "Kumar", tid: "PP105F565", price: 50, items: "coke, samosa" },
        { id: 3, name: "Kia", tid: "PP10545566", price: 50, items: "coke, samosa, dosa" },
        { id: 4, name: "Ravi", tid: "PP105FFDc", price: 50, items: "Pizza x 1" },
        { id: 5, name: "Kumar", tid: "PP105F565", price: 50, items: "coke, samosa" },
        { id: 6, name: "Kia", tid: "PP10545566", price: 50, items: "coke, samosa, dosa" }
    ];

    return (
        <div>
            <div className='d-flex justify-content-between align-items-center mb-2'>
                <h5>View Transactions</h5>
                <div>
                    <CalendarMonthIcon /> 12.03.2025
                </div>
            </div>

            <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto", position: "relative" }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Student Name</TableCell>
                            <TableCell>Transaction Id</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Order Items</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.tid}</TableCell>
                                <TableCell><CurrencyRupeeIcon className="fs-14 text-black" /> {item.price}</TableCell>
                                <TableCell>{item.items}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{ position: "sticky", bottom: 0, background: "#e4e4e4", zIndex: 1 }}>
                    <Table>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="fw-600 text-dark" width={265}>Total</TableCell>
                                <TableCell className="fw-600 text-dark" width={300}>120 Orders</TableCell>
                                <TableCell className="fw-600 text-dark"><CurrencyRupeeIcon className="fs-14 text-black" /> 300 Total Sales</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </TableContainer>
        </div>
    );
};

export default ViewTransactions;