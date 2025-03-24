import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../config/api";
import logo from '../assets/images/logo.png';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


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
        <Container fluid>
          <Navbar.Brand href="#home">
            <img src={logo} alt="Preview" height="35" />
          </Navbar.Brand>
          <DropdownButton
            align="end"
            title="Admin"
            id="dropdown-menu-align-end"
            variant="danger"
            size='sm'
          >
            {/* <Dropdown.Item>Super Admin</Dropdown.Item>
            <Dropdown.Item className='border-bottom'></Dropdown.Item> */}
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </DropdownButton>
        </Container>
      </Navbar>
      {/* <Sidebar /> */}
    </>
  );
}

export default Header;
