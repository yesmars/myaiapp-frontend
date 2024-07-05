import React, { useState, useRef } from 'react';
import './vanAi.css';
import { marked } from 'marked';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import AppNavbar from '../components/navbar';
import SuggestionCard from '../components/SuggestionCards';
import { Container, Row, Col } from 'react-bootstrap';

const VanAi = () => {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');
    const [imageInput, setImageInput] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const conversationDivRef = useRef(null);

    const suggestions = [
        "What is the weather today?",
        "Tell me a joke.",
        "Explain the theory of relativity.",
        "What's the latest news?",
        "Describe the Mona Lisa painting."
    ];

    const scrollToBottom = () => {
        const conversationDiv = conversationDivRef.current;
        if (conversationDiv) {
            conversationDiv.scrollTop = conversationDiv.scrollHeight;
        }
    };

    const fileInputRef = useRef(null);

    const handleSubmit = async (e, question, imageInput) => {
        if (e) e.preventDefault();
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
            setShowSuggestions(false);
            scrollToBottom();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

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

            if (!response.ok) {
                setError('Failed to send message');
                return;
            }

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

                if (output.startsWith('data:image/')) {
                    const imageUrl = output.trim();
                    botMsg.content = `
                        <div>
                            <img src="${imageUrl}" alt="Generated Image" style="width: 400px;" /> <br />
                            <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
                        </div>`;
                    botMsg.isImage = true;
                } else {
                    const rawHtml = marked(output);
                    const cleanHtml = DOMPurify.sanitize(rawHtml);
                    botMsg.content = cleanHtml;
                    botMsg.isImage = false;
                }
                console.log("Bot Message: ", botMsg.content); // Add this line to check the bot message
                setConversation([...newConversation]);
                scrollToBottom();
                if (done) break;
            }
          
        } catch (error) {
            console.error("Error:", error);
            setError('An error occurred. Please try again.');
        }
    };

    const handleSuggestionClick = (suggestion) => {
        handleSubmit(null, suggestion, null);
    };

    return (
        <>
            <div>
                <AppNavbar />
            </div>
            <div>
                <h1 className="vanAi-text">VAN-AI</h1>
                <div className="vanAi-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/aiGodess.png)` }}></div>
                {showSuggestions && (
                    <Container>
                        <Row>
                            {suggestions.map((suggestion, index) => (
                                <Col key={index} md={4}>
                                    <SuggestionCard suggestion={suggestion} onClick={handleSuggestionClick} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                )}
                <div className="conversation-container" id="conversation" ref={conversationDivRef} style={{ marginBottom: "60px" }}>
                    {conversation.map((msg, index) => (
                        <div key={index} className={`${msg.type}-message`}>
                            {msg.type === 'image' ? (
                                <img src={msg.content} alt="User Upload" style={{ width: '400px' }} />
                            ) : msg.type === 'bot' && typeof msg.content === 'string' ? (
                                <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
                            ) : (
                                parse(DOMPurify.sanitize(msg.content))
                            )}  
                        </div>
                    ))}
                </div>
                <form onSubmit={(e) => handleSubmit(e, question, imageInput)} encType="multipart/form-data">
                    <div className="input-container fixed-bottom bg-custom p-3" style={{ width: "100%", boxShadow: "0 -2px 5px rgba(0,0,0,0.1)" }}>
                        <div className="input-group">
                            <input type="file" ref={fileInputRef} id="imageInput" name="imageInput" accept="image/*" onChange={(e) => setImageInput(e.target.files[0])} />
                            <input type="text" id="question" name="question" className="input-field" value={question} onChange={(e) => setQuestion(e.target.value)} />
                            <button type="submit" id="submit-button" className="submit-button">Submit</button>
                        </div>
                    </div>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
        </>
    );
};

export default VanAi;
