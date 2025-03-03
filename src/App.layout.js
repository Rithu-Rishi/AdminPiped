import React from "react";
import Header from "./layouts/Header";
import Container from 'react-bootstrap/Container';
import { useLocation } from "react-router-dom";
const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderRoutes = ["/login"].includes(location.pathname);
    return (
        <main>
            {!hideHeaderRoutes && <Header />}
            <Container fluid className="mt-3">
                {children}
            </Container>
        </main>
    );
};

export default Layout;
