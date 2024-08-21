import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1>Conversations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {conversations.slice().reverse().map(({ thread_id, conversation_log }) => (
            <li key={thread_id}>
              <h3>{thread_id}</h3>
              <ul>
                {conversation_log.slice().reverse().map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Conversations;

