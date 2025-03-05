import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/perantslist">Parents List</Nav.Link>
            <Nav.Link as={Link} to="/childlist">Child List</Nav.Link>
            {/* <Nav.Link href="/">All Programs</Nav.Link> */}
            <NavDropdown title="Programs" id="collapsible-nav-dropdown">
              <NavDropdown.Item as={Link} to="/programs">All Programs</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/subPrograms">Sub Programs</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/subProgramFocus">Program Focus</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/programSkill">Programs Skills</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/skillProgression">Skill Progression</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/teachers">Teachers</Nav.Link>
            <Nav.Link href="/">Teachers Feedback</Nav.Link>
            <Nav.Link href="/">Transitions</Nav.Link>
            <Nav.Link href="/">Class Bookings</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Sidebar;
