import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ConversationsSidebar.css'; // Make sure to create a separate CSS file for styling

const ConversationsSidebar = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.removeItem('token');
      console.log("Check Token:", token);
      navigate('/login');
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/retrieve-message`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.length === 0) {
          setError('No conversation log found');
        } else {
          setConversations(response.data);
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error);
        } else {
          setError('An error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [API_BASE_URL, navigate]);

  const handleSelectConversation = (thread_id) => {
    onSelectConversation(thread_id);
    setIsOpen(false);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Open'} Conversations
      </button>
      <div className="sidebar-content">
        <h1>Conversations</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <ul>
            {conversations.slice().reverse().map(({ thread_id }) => (
              <li key={thread_id} onClick={() => handleSelectConversation(thread_id)}>
                <h3>Thread ID: {thread_id}</h3>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar;
