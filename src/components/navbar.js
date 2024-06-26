import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './navbar.css';
import { useAuth } from './authContext';

function AppNavbar() {
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
      <Navbar.Brand href="/home">
        <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {!isLoggedIn ? (
            <>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>  
              </LinkContainer>
              <LinkContainer to="/signup">
                <Nav.Link>Sign Up</Nav.Link>  
              </LinkContainer>
            </>
          ) : (
            <LinkContainer to="/home">
            <Nav.Link onClick={logout}>Logout</Nav.Link>
            </LinkContainer>
          )}
          <LinkContainer to="/vanai">
            <Nav.Link>Van-AI</Nav.Link>  
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
