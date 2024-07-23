// AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/admin-login', { password });
      if (response.data.success) {
        setUsers(response.data.users);
        setError('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2 className='text-center'>Admin Login</h2>
      <div className='text-center'>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter admin password"
        />
        <button type="submit">Submit</button>
      </form>
      </div>
      {error && <p>{error}</p>}
      {users.length > 0 && (
        <div style={{paddingLeft:'40%'}} >
          <br />
          <h3 >User Emails and First Names</h3>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.first_name} - {user.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
