import React, { useState, useRef,useEffect,useCallback } from 'react';
import './vanAi.css';
import { marked } from 'marked';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import AppNavbar from '../components/navbar';
import SuggestionCard from '../components/SuggestionCards';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

const VanAi = () => {
    const [question, setQuestion] = useState('');
    const [error, setError] = useState('');
    const [imageInput, setImageInput] = useState(null);
    const [conversation, setConversation] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [nextSuggestions, setNextSuggestions] = useState([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [sidebarError, setSidebarError] = useState('');
    const [currentThreadId, setCurrentThreadId] = useState(null);
    const conversationDivRef = useRef(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const suggestions = [
        "Tell me a joke.",
        "Create a picture of a cute cat.",
        "generate an audio of the words I love you in Vietnamese please"
    ];
    const fileInputRef = useRef(null);
    const bottomRef = useRef(null);
    // Function to scroll to the bottom of the conversation
    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };
   
    //scroll to the bottom of the conversation  when the conversation state changes
    useEffect(() => {
        scrollToBottom();
    }, [conversation]);

    // Function to toggle the sidebar
    const fetchConversations = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.removeItem('token');
            navigate('/login');
            setSidebarError('User not authenticated');
            setSidebarLoading(false);
            return;
        }

        setSidebarLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/retrieve-message`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.length === 0) {
                setSidebarError('No conversation log found');
                setConversations([]);
            } else {
                setConversations(response.data);
                console.log("Conversations: ", response.data);
            }
        } catch (err) {
            if (err.response) {
                setSidebarError(err.response.data.error);
            } else {
                setSidebarError('An error occurred. Please try again.');
            }
        } finally {
            setSidebarLoading(false);
        }
    }, [API_BASE_URL, navigate]);

    // Fetch conversations on component mount (login)
    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const createNewChat = useCallback(() => {
        setConversation([]);
        setShowSuggestions(true);
        setNextSuggestions([]);
        setCurrentThreadId(null);
        setShowSidebar(false);

        // Fetch the updated conversations
        fetchConversations();
    }, [fetchConversations]);

    
   
    // Function to handle form submission
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
            if (currentThreadId) {
                formData.append('thread_id', currentThreadId);
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
                if (output.includes('data:image/') && output.includes('data:audio/')) {
                    const [textPart, imageAndAudioPart] = output.split('data:image/');
                    const [imagePart, audioPart] = imageAndAudioPart.split('data:audio/');
                    if (textPart.trim()) {
                        const rawHtml = marked(textPart.trim());
                        const cleanHtml = DOMPurify.sanitize(rawHtml);
                        botMsg.content = cleanHtml;
                        console.log("Bot Message text: ", botMsg.content); // Add this line to check the bot message
                    }
                    if (imagePart) {
                        const imageUrl = `data:image/${imagePart.trim()}`;
                        console.log("Image URL: ", imageUrl); // Add this line to check the image URL
                        botMsg.content += `
                            <div>
                                <img src="${imageUrl}" alt="Generated Image" style="width:50%; height:auto;" /> <br />
                                <div style="text-align: right;">
                                    <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
                                </div>
                            </div>`;
                        botMsg.isImage = true;
                    }
                    if (audioPart) {
                        const audioUrl = `data:audio/${audioPart.trim()}`;
                        console.log("Audio URL: ", audioUrl); // Add this line to check the audio URL
                        botMsg.content += `
                            <div>
                                <audio controls>
                                    <source src="${audioUrl}" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>`;
                        botMsg.isAudio = true;
                    }
                } else if (output.includes('data:image/')) {
                    const [textPart, imagePart] = output.split('data:image/');
                    if (textPart.trim()) {
                        const rawHtml = marked(textPart.trim());
                        const cleanHtml = DOMPurify.sanitize(rawHtml);
                        botMsg.content = cleanHtml;
                        const imageUrl = `data:image/${imagePart.trim()}`;
                        botMsg.content += `
                            <div>
                                <img src="${imageUrl}" alt="Generated Image" style="width:50%; height:auto;" /> <br />
                                <div style="text-align: right;">
                                    <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
                                </div>
                            </div>`;
                        botMsg.isImage = true;
                    } else if (output.startsWith('data:image/')) {
                        const imageUrl = output.trim();
                        console.log("Image URL: ", imageUrl); // Add this line to check the image URL
                        botMsg.content = `
                            <div>
                                <img src="${imageUrl}" alt="Generated Image" style="width:50%; height:auto;" /> <br />
                                <div style="text-align: right;">
                                    <a href="${imageUrl}" download="generated_image.jpg" class="download-button">Download</a>
                                </div>
                            </div>`;
                        botMsg.isImage = true;
                        console.log("Bot Message image: ", botMsg.content); // Add this line to check the bot message
                    }
                } else if (output.includes('data:audio/')) {

                    const [textPart, audioPart] = output.split('data:audio/');
                    if (textPart.trim()) {
                        const rawHtml = marked(textPart.trim());
                        const cleanHtml = DOMPurify.sanitize(rawHtml);
                        botMsg.content = cleanHtml;
                        const audioUrl = `data:audio/${audioPart.trim()}`;
                        botMsg.content += `
                        <div>
                        <audio controls>
                            <source src="${audioUrl}" type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                        </div>`;
                        botMsg.isAudio = true;
                    } else if (output.startsWith('data:audio/')) {
                        const audioUrl = output.trim();
                        console.log("Audio URL: ", audioUrl); // Add this line to check the audio URL
                        botMsg.content = `
                            <div>
                            <audio controls>
                                <source src="${audioUrl}" type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            </div>`;
                        botMsg.isAudio = true;
                        console.log("Bot Message audio: ", botMsg.content); // Add this line to check the bot message

                    }
                } else {
                    
                    const rawHtml = marked(output);
                    const cleanHtml = DOMPurify.sanitize(rawHtml);
                    botMsg.content = cleanHtml;
                    botMsg.isImage = false;
                    botMsg.isAudio = false;
                    if (botMsg.content === '') {
                        botMsg.content = "I'm sorry, an error occurred. Please try to log out and login again.";
                    }
                }
                console.log("Bot Message: ", botMsg.content); // Add this line to check the bot message
                setConversation([...newConversation]);

                if (done) break;
            }
            // Fetch the next suggestions
            const textResponse = stripHtmlTags(botMsg.content);
            const nextSuggestionsResponse = await fetch(`${API_BASE_URL}/suggestions`, {
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
        scrollToBottom();
       
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
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
    // Function to handle conversation click
    const handleConversationClick = (thread_id, conversation_log) => {
        // Parse the conversation log and set it to the conversation state
        const parsedConversation = conversation_log.slice().reverse().map((msg) => {
            const [type, ...contentArray] = msg.split(': ');
            const content = marked(contentArray.join(': '));
            return { type: type.trim().toLowerCase(), content };
        });
        setConversation(parsedConversation);
        setShowSidebar(false); // Optionally close the sidebar
        setCurrentThreadId(thread_id);
        setShowSuggestions(false);
        setNextSuggestions([]);

    };
    

    return (
        <div className={`vanAi-container ${showSidebar ? 'sidebar-open' : ''}`}>
            <AppNavbar toggleSidebar={toggleSidebar} showSidebar={showSidebar}/>
            
            {/*!showSidebar && (
            <button className="toggle-sidebar" onClick={toggleSidebar}>
                {showSidebar ? '<<' : '>>'}
            </button>
            )*/}
            
            <div className={`conversation-sidebar ${showSidebar ? 'show' : ''}`}>
                <br />
                
                <br />
                
                <br />
                <div className="sidebar-header" style={{textAlign:"right"}}>
                <button className="close-sidebar" onClick={toggleSidebar}>X</button>
                </div>
                <div className='new-chat-button' >
                <button className="new-chat" onClick={() => createNewChat()}>create new chat</button>
                </div>
                {sidebarLoading ? (
                    <p>Loading...</p>
                ) : sidebarError ? (
                    <p>{sidebarError}</p>
                ) : (
                    <ul className="conversation-list">
                        {conversations.slice().reverse().map(({ summary,thread_id, conversation_log }) => {
                            // Show the first 2 messages and the last message with '...' in between
                            

                            return (
                                <li key={thread_id} className="conversation-item" onClick={() => handleConversationClick(thread_id, conversation_log)}>
                                    <br />
                                    <p style={{ fontWeight: 'bold', textAlign: 'left' }}>{parse(marked(summary))}</p>
                                    {console.log("Sumary: ", summary)}
                                    
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>


            <div className="vanAi-content">
                
            
                <div className="conversation-container" id="conversation" ref={conversationDivRef} style={{ marginBottom: "60px" }}>
                    {conversation.map((msg, index) => (
                        <div className='message-container'>
                        <div key={index} className={`${msg.type}-message`}>
                            {msg.type === 'image' ? (
                                <div style={{ display: 'flex', justifyContent:'center', backgroundColor:'black', paddingTop:"10%", paddingBottom:'10%' }}>
                                    <img src={msg.content} alt="User Upload" style={{ width: '50%' }} />
                                </div>
                            ) : msg.type === 'bot' && typeof msg.content === 'string' ? (
                                <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
                            ) : (
                                parse(DOMPurify.sanitize(msg.content))
                            )}
                        </div>
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
                    <div ref={bottomRef} />
                </div>
            </div>
            
            <Form onSubmit={(e) => handleSubmit(e, question, imageInput)}  encType="multipart/form-data">
            
                <div className='input-container'>
                    <div className="input-group"> 
                        <input type="file" ref={fileInputRef} id="imageInput" name="imageInput" accept="image/*" onChange={(e) => setImageInput(e.target.files[0])} />
                        <input type="text" id="question" name="question" className="input-field" value={question} onChange={(e) => setQuestion(e.target.value)} />
                        <Button type="submit" id="submit-button" className="submit-button">Submit</Button>
                    </div>
                </div>
            </Form>
            {error && <div className="error-message">{error}</div>}
            <div ref={bottomRef} />
        </div>
    );
};


export default VanAi;
