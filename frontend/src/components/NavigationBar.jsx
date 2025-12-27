/**
 * Navigation Bar Component
 * Shows navigation links and user info
 */
import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavigationBar.css';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" style={{ fontWeight: 'bold' }}>
          <i className="bi bi-check2-square me-2"></i>
          AI Voting System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard" style={{ fontWeight: 'bold' }}>
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/vote" style={{ fontWeight: 'bold' }}>
              <i className="bi bi-pencil-square me-1"></i>
              Vote
            </Nav.Link>
            <Nav.Link as={Link} to="/results" style={{ fontWeight: 'bold' }}>
              <i className="bi bi-bar-chart me-1"></i>
              Results
            </Nav.Link>
            <Nav.Link as={Link} to="/ai-insights" style={{ fontWeight: 'bold' }}>
              <i className="bi bi-robot me-1"></i>
              AI Insights
            </Nav.Link>
            
            <NavDropdown 
              title={
                <>
                  <i className="bi bi-person-circle me-1"></i>
                  <span style={{ fontWeight: 'bold' }}>
                    {(user?.nickname || 'USER').toUpperCase()}
                  </span>
                </>
              } 
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item disabled>
                <small className="text-muted">ID: {user?.student_id}</small>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
