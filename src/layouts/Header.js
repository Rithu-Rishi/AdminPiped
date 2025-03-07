import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../config/api";
import logo from '../assets/images/logo.png'


function Header() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Call the Laravel logout API
      await API.post("/api/logout");

      // Clear the session storage
      setAuthToken(null);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout Failed", error);
    }
  };

  return (
    <>
      <Navbar className="bg-white main_header">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo} alt="Preview" height="35" />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="ms-auto">
              <NavDropdown title="Admin" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1" onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* <Sidebar /> */}
    </>
  );
}

export default Header;
