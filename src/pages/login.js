import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/authContext';
import AppNavbar from '../components/navbar';
import { Button } from 'react-bootstrap';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './login.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  console.log(API_BASE_URL);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.access_token); // Store token in local storage
        login(); // Update the context
        navigate('/vanai'); // Redirect to the dashboard
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/google-login`, {
        token: response.credential,
      });
      if (res.data.success) {
        localStorage.setItem('token', res.data.access_token); // Store token in local storage
        login(); // Update the context
        navigate('/vanai'); // Redirect to the dashboard
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  return (
    <>
    <AppNavbar />
    <header >
    

    </header>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
         
          <br />
          <br />
          <div className='control'>
          <div className="form-control">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              
              <br />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                className="form-control"
                required
                placeholder='email'
              />
            </div>
            <div className="form-group">
              <br />
              <br />
              
              <br />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                className="form-control"
                required
                placeholder='password'
              />
            </div>
            {error && <p>{error}</p>}
            <br />
            <br />
            <div className="d-grid gap-2">
            <Button variant="primary" type="submit" >Log in </Button>
            
            </div>
            <br />
            <br />
            <div className="google-login-container" >
            
                  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                    <div >
                    <GoogleLogin 
                      className="google-login-button"
                      onSuccess={handleGoogleLoginSuccess}
                      onError={() => {
                        setError('Google login failed');
                      }}
                      buttonText="Login with Google"
                    />
                    </div>
                  </GoogleOAuthProvider>
          </div>
            
          </form>
          
          <div>
            <br />
            <br />
            <p className='text-center'>
              Don't have an account? <a href="/signup">Sign up</a>
            </p>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
