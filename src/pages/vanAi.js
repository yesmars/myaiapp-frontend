import React, { useState, useRef } from 'react';
import './vanAi.css';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const VanAi = () => {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');
    const [imageInput, setImageInput] = useState(null);
    const [conversation, setConversation] = useState([]);
    const conversationDivRef = useRef(null);

    const scrollToBottom = () => {
        const conversationDiv = conversationDivRef.current;
        if (conversationDiv) {
            conversationDiv.scrollTop = conversationDiv.scrollHeight;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!question && !imageInput) {
                setError("Please provide a question or an image");
                return;
            }

            setError('');
            const newConversation = [...conversation];
            if (question) {
                newConversation.push({ type: 'user', content: question });
            }
            if (imageInput) {
                const userImageURL = URL.createObjectURL(imageInput);
                newConversation.push({ type: 'image', content: userImageURL });
            }
            newConversation.push({ type: 'loading', content: 'Loading...' });
            setConversation(newConversation);
            setQuestion('');
            setImageInput(null);
            scrollToBottom();

            const formData = new FormData();
            formData.append('question', question);
            if (imageInput) {
                formData.append('imageInput', imageInput);
            }
            const token = localStorage.getItem('token');
            if (!token) {
                setError('User not authenticated');
                return;
            }
            console.log("Token: ", token); // Add this line to check the token


            const response = await fetch('http://127.0.0.1:5000/vanai', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const reader = response.body.getReader();
            let output = '';
            const botMsg = { type: 'bot', content: '' };
            newConversation.pop();
            newConversation.push(botMsg);
            setConversation(newConversation);
            scrollToBottom();

            while (true) {
                const { done, value } = await reader.read();
                output += new TextDecoder().decode(value || new Uint8Array(), { stream: !done });
                const rawHtml = marked(output);
                const cleanHtml = DOMPurify.sanitize(rawHtml);
                botMsg.content = cleanHtml;
                setConversation([...newConversation]);
                scrollToBottom();
                if (done) break;
            }
        } catch (error) {
            console.error("Error:", error);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1 className="vanAi-text">VAN-AI</h1>
            <div className="vanAi-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/aiGodess.png)` }}></div>
            <div className="conversation-container" id="conversation" ref={conversationDivRef} style={{ marginBottom: "60px" }}>
                {conversation.map((msg, index) => (
                    <div key={index} className={msg.type === 'user' ? 'user-question' : msg.type === 'bot' ? 'bot-response' : 'user-image'}>
                        {msg.type === 'image' ? (
                            <img src={msg.content} alt="User Upload" style={{ width: '400px' }} />
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
                        )}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="input-container fixed-bottom bg-light p-3" style={{ width: "100%", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
                    <div fused-inputs></div>
                    <div className="input-group">
                        <input type="file" id="imageInput" name="imageInput" accept="image/*" onChange={(e) => setImageInput(e.target.files[0])} />
                        <input type="text" id="question" name="question" className="input-field" value={question} onChange={(e) => setQuestion(e.target.value)} />
                        <button type="submit" id="submit-button" className="submit-button">Submit</button>
                    </div>
                </div>
            </form>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default VanAi;
