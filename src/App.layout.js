import React, { useState } from "react";
import Header from "./layouts/Header";
import Container from 'react-bootstrap/Container';
import { useLocation } from "react-router-dom";
import Sidebar from "./layouts/Sidebar";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderRoutes = ["/login"].includes(location.pathname);

    return (
        <main>
            {!hideHeaderRoutes && <Header />}
            <div className="app-container d-flex">
                <Sidebar />
                <div className="content-container w-100">
                    <Container fluid className="mt-3">
                        {children}
                    </Container>
                </div>
            </div>
        </main>
    );
};

export default Layout;
