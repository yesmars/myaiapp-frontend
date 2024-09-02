import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './navbar.css';
import { useAuth } from './authContext';

function AppNavbar({ toggleSidebar, showSidebar }) {
  const { isLoggedIn, logout,login } = useAuth();

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      login();
    }
  }, [login]);

  return (
    <Navbar bg="light" expand="lg" className="bg-custom">
      <Nav className="nav-item toggle-sidebar" onClick={toggleSidebar}>
            {showSidebar ? '[x]' : '[0]'}
      </Nav>
      <Navbar.Brand href="/home">
        <img src={`${process.env.PUBLIC_URL}/images/Olivia.svg`} alt="Logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className='nav-colapse' id="basic-navbar-nav">
        <Nav className="mr-auto">
          {!isLoggedIn ? (
            <>
              <LinkContainer to="/login">
                <Nav.Link className='nav-item'>Login</Nav.Link>  
              </LinkContainer>
              <LinkContainer to="/signup">
                <Nav.Link className='nav-item'>Sign Up</Nav.Link>  
              </LinkContainer>
            </>
          ) : (
            <LinkContainer to="/home">
            <Nav.Link className='nav-item' onClick={logout}>Logout</Nav.Link>
            </LinkContainer>
          )}
          <LinkContainer to="/vanai">
            <Nav.Link className='nav-item'>Van-AI</Nav.Link>  
          </LinkContainer>
          <LinkContainer to="/pronunciation">
            <Nav.Link className='nav-item'>Pronunciation</Nav.Link>
            </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
