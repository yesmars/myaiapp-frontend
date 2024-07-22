// src/components/Callback.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';

const Callback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      login();
      navigate('/vanai');
    } else {
      navigate('/login');
    }
  }, [navigate, login]);

  return (
    <div>
      Redirecting...
    </div>
  );
};

export default Callback;
