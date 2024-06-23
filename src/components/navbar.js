import React, { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './navbar.css';

function AppNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <LinkContainer to="/logout">
              <Nav.Link>Logout</Nav.Link>  
            </LinkContainer>
          )}
          <LinkContainer to="/vision">
            <Nav.Link>Vision</Nav.Link>  
          </LinkContainer>
          <LinkContainer to="/merge">
            <Nav.Link>MergeAI</Nav.Link>  
          </LinkContainer>
          <LinkContainer to="/vanai">
            <Nav.Link>Van-AI</Nav.Link>  
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;

