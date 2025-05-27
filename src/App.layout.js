import React from "react";
import Header from "./layouts/Header";
import Container from 'react-bootstrap/Container';
import { useLocation, Outlet } from "react-router-dom";
import SidebarMenu from "./layouts/Sidebar";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideHeaderRoutes = location.pathname === "/login";

    return (
        <main>
            {!hideHeaderRoutes && <Header />}
            <div className="app-container d-flex">            
                {!hideHeaderRoutes && <SidebarMenu />}
                <div className="content-container w-100">
                    <Container fluid className={hideHeaderRoutes ? "" : "mt-3"}>
                        <Outlet />
                    </Container>
                </div>
            </div>
        </main>
    );
};

export default Layout;
