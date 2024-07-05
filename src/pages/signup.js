import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../components/navbar';

const Signup = () => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState(''); // Add state for last name
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/signup', {
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
            window.alert('Account created successfully!');
          
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage(error.message);
            }
        }
        
    };

    return (
        <>
        <AppNavbar />
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-center"> Sign Up </h3>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input 
                                type="text" 
                                value={firstname} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                id="first_name" 
                                name="first_name" 
                                className="form-control" 
                                required 
                            />
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
                                required 
                            />
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
                                required 
                            />
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
                                required 
                            />
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
                                required 
                            />
                        </div>
                        
                        
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
        </>
    );
}

export default Signup;
