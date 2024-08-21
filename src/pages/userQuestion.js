// AdminLogin.js
import React, { useState } from 'react';
import axios from 'axios';

const UserQuestion = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/user-question`, { password });
      if (response.data.success) {
        setQuestions(response.data.questions);
        console.log(response.data.questions);
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
      <h2 className='text-center'>User Question</h2>
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
      {questions.length > 0 && (
        <div style={{paddingLeft:'40%'}} >
          <br />
          <h3 >User question</h3>
          <ul>
            {questions.map((questions, index) => (
              <li key={index}>{questions.question_text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserQuestion;