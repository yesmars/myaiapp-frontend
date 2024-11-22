import {useState, useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import{ processBotMessage } from '../utilityFunction/processBotMessage';

const useConversationHandle= (API_BASE_URL) => {
    const [conversation, setConversation] = useState([]);
    const [currentThreadId, setCurrentThreadId] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmitUserMessage= useCallback(async(question, imageInput) => {
        if (!question && !imageInput) {
            setError('Please provide a question or an image');
            return;
        }
        setError('');
        setIsLoading(true);
        const newConversation = [...conversation];
        if (question) {
            newConversation.push({ type: 'user', content: question });
          }
      
          if (imageInput) {
            const userImageURL = URL.createObjectURL(imageInput);
            newConversation.push({ type: 'image', content: userImageURL });
          }
      
          // Add a loading message for the bot's response
          newConversation.push({ type: 'loading', content: 'Loading...' });
          setConversation(newConversation);
        try {
            const formData= new FormData();
            formData.append('question', question);
           if (imageInput) {
            formData.append('imageInput', imageInput);
            
             }
           if (currentThreadId) {
                formData.append('thread_id', currentThreadId);
            }

            const token = localStorage.getItem('token');
            if (!token) {
                localStorage.removeItem('token');
         
                navigate('/login');
                setError('User not authenticated');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/vanai`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                setError('User not authenticated');
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            const newThreadId = response.headers.get('X-Thread-Id');
            if (newThreadId && !currentThreadId) setCurrentThreadId(newThreadId);
            
            const reader = response.body.getReader();
            let output = '';
           
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                output += new TextDecoder().decode(value);
                const botMsg = processBotMessage(output);  
                newConversation[newConversation.length - 1] = botMsg;
                setConversation([...newConversation]);
            }
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }


    },[ API_BASE_URL, conversation, currentThreadId, navigate]);
    return {
        conversation,
        setConversation,
        currentThreadId,
        setCurrentThreadId,
        error,
        isLoading,
        handleSubmitUserMessage
      };
    };

export default useConversationHandle;