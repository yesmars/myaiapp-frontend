import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/navbar';
import Button from 'react-bootstrap/Button';

const Signup = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState(''); // Add state for last name
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/signup`, {
                firstname,
                lastname, // Include last name
                email,
                password1,
                password2,
            });
            setMessage(response.data.message);
            
            
            // Redirect the user to /vanai
            navigate('/vanai');
            // Show an alert
            window.alert(response.data.message);
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
        
    };

    return (
        <>
        <AppNavbar />
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className='control'>
                    <div className="form-control">
                    <form onSubmit={handleSubmit}>
                        <br />
                        <br />
                        
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input 
                                type="text" 
                                value={firstname} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                id="first_name" 
                                name="first_name" 
                                className="form-control" 
                                style={{backgroundColor:'#e0e0de', color:'#383C1A'}}
                                required 
                            />
                            <br />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input 
                                type="text" 
                                value={lastname} 
                                onChange={(e) => setLastName(e.target.value)} 
                                id="last_name" 
                                name="last_name" 
                                className="form-control" 
                                style={{backgroundColor:'#e0e0de', color:'#383C1A'}}
                                required 
                            />
                            <br />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                id="email" 
                                name="email" 
                                className="form-control" 
                                style={{backgroundColor:'#e0e0de', color:'#383C1A'}}
                                required 
                            />
                            <br />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input 
                                type="password" 
                                value={password1} 
                                onChange={(e) => setPassword1(e.target.value)} 
                                id="password" 
                                name="password" 
                                className="form-control" 
                                style={{backgroundColor:'#e0e0de', color:'#383C1A'}}
                                required 
                            />
                            <br />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password</label>
                            <input 
                                type="password" 
                                value={password2} 
                                onChange={(e) => setPassword2(e.target.value)} 
                                id="password2" 
                                name="password2" 
                                className="form-control" 
                                style={{backgroundColor:'#e0e0de', color:'#383C1A'}}
                                required 
                            />
                            <br />
                        </div>
                        
                        <div className="d-grid gap-2">
                            
                            <Button variant="primary" type="submit" >Sign Up </Button>
                        </div>
                        <br />
                        <br />
                        
                    </form>
                    </div>
                    </div>
                    {message && <p className='text-center'>{message}</p>}
                </div>
            </div>
        </div>
        </>
    );
}

export default Signup;
