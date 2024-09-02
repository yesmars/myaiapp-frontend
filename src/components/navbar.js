import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { IoSettings } from "react-icons/io5";
import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";
import './navbar.css';
import { useAuth } from './authContext';
import { Dropdown } from 'react-bootstrap';

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
    <Navbar bg="light" expand={false} className="bg-custom" fixed='top'>
      <Navbar.Brand className="mx-auto">
        <img className='logo' src={`${process.env.PUBLIC_URL}/images/Olivia.svg`} alt="Logo" />
      </Navbar.Brand>
    
      <Nav.Item className="nav-item toggle-sidebar" onClick={toggleSidebar}>
      <div className='control-toggle-sidebar'>
        {showSidebar ? <GoSidebarExpand />: <GoSidebarCollapse />}
      </div>
      </Nav.Item>
 
      <Dropdown>
    <Dropdown.Toggle variant="success" id="dropdown-basic">
    <IoSettings />
    </Dropdown.Toggle>

    <Dropdown.Menu>
      {!isLoggedIn ? (
        <>
          <LinkContainer to="/login">
            <Dropdown.Item>Login</Dropdown.Item>
          </LinkContainer>
          <LinkContainer to="/signup">
            <Dropdown.Item>Sign Up</Dropdown.Item>
          </LinkContainer>
        </>
      ) : (
        <>
        <LinkContainer to="/home">
          <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        </LinkContainer>
        <LinkContainer to="/pronunciation">
          <Dropdown.Item>Pronunciation</Dropdown.Item>
        </LinkContainer>
        </>
      )}
      <LinkContainer to="/vanai">
        <Dropdown.Item>Van-AI</Dropdown.Item>
      </LinkContainer>
    </Dropdown.Menu>
  </Dropdown>
</Navbar>
  );
}

export default AppNavbar;
