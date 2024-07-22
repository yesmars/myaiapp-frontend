import React from 'react';
import './App.css';
import Login from './pages/login';
import Signup from './pages/signup';
import PrivateRoute from './components/PrivateRoute';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import VanAi from './pages/vanAi';
import { AuthProvider } from './components/authContext';
import Callback from './components/GoogleCallBack';
import AdminLogin from './pages/AdminLogin';
function App() {
  return (
    <div>
      <AuthProvider>
        
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<><Home/></>} />
        <Route path="/vanai" element={<><PrivateRoute element={VanAi}/></>} />
        <Route path="/oauth2/callback" element={<Callback />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* The HeroSection is now part of the Home route */}
        {/* Add other routes here */}
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
