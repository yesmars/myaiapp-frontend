import React, { useState, useRef } from 'react';
import './vanAi.css';
import { marked } from 'marked';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import AppNavbar from '../components/navbar';
import SuggestionCard from '../components/SuggestionCards';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Base64AudioPlayer from '../components/b64audio';
import { useNavigate } from 'react-router-dom';

const VanAi = () => {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');
    const [imageInput, setImageInput] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [nextSuggestions, setNextSuggestions] = useState([]);
    const conversationDivRef = useRef(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const suggestions = [
        
        "Tell me a joke.",
        "Create a picture of a cute cat.",
        "generate an audio of the words I love you in Vietnamese please"
    ];

    const navigate = useNavigate();
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
            // Clear the input fields
            setQuestion('');
            setImageInput(null);
            setShowSuggestions(false);
            setNextSuggestions(false);
            scrollToBottom();
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // Send the question to the server
            const formData = new FormData();
            formData.append('question', question);
            if (imageInput) {
                formData.append('imageInput', imageInput);
            }

            const token = localStorage.getItem('token');
            if (!token) {
                localStorage.removeItem('token');
                console.log("check Token: ", token); // Add this line to check the token
                navigate('/login');
                setError('User not authenticated');
                
                return;
            }
            console.log("Token: ", token); // Add this line to check the token

            const response = await fetch(`${API_BASE_URL}/vanai`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                setError('User not authenticated');
                return;
            }

            if (!response.ok) {
                setError('Failed to send message');
                return;
            }
            // Read the response as a stream
            const reader = response.body.getReader();
            let output = '';
            let base64Audio = '';
            const botMsg = { type: 'bot', content: '' };
            newConversation.pop();
            newConversation.push(botMsg);
            setConversation(newConversation);
            scrollToBottom();
            // Read the stream
            while (true) {
                const { done, value } = await reader.read();
                output += new TextDecoder().decode(value || new Uint8Array(), { stream: !done });
                console.log("Output: ", output); // Add this line to check the output

                if (output.includes('data:image/')) {
                    const [textPart, imagePart] = output.split('data:image/');
                    if (textPart.trim()){
                        const rawHtml = marked(textPart.trim());
                        const cleanHtml = DOMPurify.sanitize(rawHtml);
                        botMsg.content = cleanHtml;
                        const imageUrl = `data:image/${imagePart.trim()}`;
                        botMsg.content += `
                            <div>
                                <img src="${imageUrl}" alt="Generated Image" style="width:50%; height:auto;" /> <br />
                                <div style=" text-align: right;">
                                <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
                                </div>
                            </div>`;
                        botMsg.isImage = true; 
                    }
                else if (output.startsWith('data:image/')) {
                    const imageUrl = output.trim();
                    console.log("Image URL: ", imageUrl); // Add this line to check the image URL
                    botMsg.content = `
                        <div>
                            <img src="${imageUrl}" alt="Generated Image" style="width:50%; height:auto;" /> <br />
                            <div style=" text-align: right;">
                            <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
                            </div>
                        </div>`;
                    botMsg.isImage = true;
                    console.log("Bot Message image: ", botMsg.content); // Add this line to check the bot message
                    }
                } 
                else if (output.includes('data:audio/')) {
                   
                    base64Audio += output.split('data:audio/mp3;base64,')[1];
                    botMsg.content = base64Audio;
                    console.log("Base64 Audio: ", base64Audio); // Add this line to check the base64 audio
                    botMsg.isAudio = true;
                   
                }
                else {
                    const rawHtml = marked(output);
                    const cleanHtml = DOMPurify.sanitize(rawHtml);
                    botMsg.content = cleanHtml;
                    botMsg.isImage = false;
                    botMsg.isAudio = false;
                }
                console.log("Bot Message: ", botMsg.content); // Add this line to check the bot message
                setConversation([...newConversation]);
                
                if (done) break;
            }
            // Fetch the next suggestions
            const textResponse= stripHtmlTags(botMsg.content);
            const nextSuggestionsResponse = await fetch(`${API_BASE_URL}/suggestions`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
            },
                body: JSON.stringify({ text_response: textResponse })
            });

            if (!nextSuggestionsResponse.ok) {
                setError('Failed to fetch suggestions');
                return;
            }
            const nextSuggestionsData = await nextSuggestionsResponse.json();
        
            setNextSuggestions(nextSuggestionsData);
            console.log("Next Suggestions: ", nextSuggestionsData); // Add this line to check the next suggestions
        } catch (error) {
            console.error("Error:", error);
            setError('An error occurred. Please try again.');
        }
    };
    // Function to strip HTML tags
    const stripHtmlTags = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const handleSuggestionClick = (suggestion) => {
        const plainTextSuggestion = stripHtmlTags(suggestion);
        handleSubmit(null, plainTextSuggestion, null);
    };
    
    return (
        <>
           <div className="vanAi-container">
                <AppNavbar />
            
                <div className="vanAi-content">
                
                {/*<div className="vanAi-background" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/aiGodess.png)` }}></div>*/}
                <div className="conversation-container" id="conversation" ref={conversationDivRef} style={{ marginBottom: "60px" }}>
                    {conversation.map((msg, index) => (
                        <div key={index} className={`${msg.type}-message`}>
                            {msg.type === 'image' ? (
                                <div style={{ display: 'flex', justifyContent:'center', backgroundColor:'black', paddingTop:"10%", paddingBottom:'10%' }}>
                                <img src={msg.content} alt="User Upload" style={{ width: '50%' }} />
                                </div>
                            ) : msg.type === 'bot' && msg.isAudio ? (
                                <Base64AudioPlayer base64String={msg.content} />
                            ) : msg.type === 'bot' && typeof msg.content === 'string' ? (
                                <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
                            ) : (
                                parse(DOMPurify.sanitize(msg.content))
                    )}
                        
                        </div>
                        ))}
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
                    {nextSuggestions.length > 0 && (
                    <div className="nextSuggestions-container">
                        
                        <div className="suggestions">
                            {nextSuggestions.map((suggestion, index) => (
                                <SuggestionCard key={index} suggestion={parse(marked(suggestion))} onClick={() => handleSuggestionClick(suggestion)} />
                            ))}
                        </div>
                    </div>
                    )}
                </div>
                </div>
                <Form onSubmit={(e) => handleSubmit(e, question, imageInput)} encType="multipart/form-data">
                
                    <div className='input-container'>
                    <div className="input-group"> 
                            
                            <input type="file" ref={fileInputRef} id="imageInput" name="imageInput" accept="image/*" onChange={(e) => setImageInput(e.target.files[0])} />
                           
                            
                            <input type="text" id="question" name="question" className="input-field" value={question} onChange={(e) => setQuestion(e.target.value)} />
                            
                            <Button type="submit" id="submit-button" className="submit-button">Submit</Button>
                            
                        </div>
                    
                    </div>
                </Form>
                {error && <div className="error-message">{error}</div>}
                
            
            </div >
        </>
        
    );
};

export default VanAi;
