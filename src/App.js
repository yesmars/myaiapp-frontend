import React from 'react';
import './App.css';
import AppNavbar from './components/navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import PrivateRoute from './components/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import VanAi from './pages/vanAi';

function App() {
  return (
    <div>
        <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<><Home/></>} />
        <Route path="/vanai" element={<><PrivateRoute element={VanAi}/></>} />
        {/* The HeroSection is now part of the Home route */}
        {/* Add other routes here */}
      </Routes>
    </div>
  );
}

export default App;
