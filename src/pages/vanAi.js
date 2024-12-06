import React, { useState, useRef,useEffect,useCallback } from 'react';
import './vanAi.css';
import { marked } from 'marked';
import AppNavbar from '../components/navbar';
import { useNavigate } from 'react-router-dom';
import highlightjs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Choose a style from highlight.js
import ShowInitialSuggestion from '../components/ShowInitialSuggestion';
import FormUI from '../components/FormUI';
import MessageUI from '../components/MessageUI';
import ChatLogSideBarUI from '../components/ChatLogSideBarUI';
import useConversationformattingEffect from '../hooks/useConversationformattingEffect'; 
import useConversationHandle from '../hooks/useConversationHandle';
import { stripHtmlTags } from '../utilityFunction/stripHtmlTags';
import { retrievePastMessage } from '../utilityFunction/retrievePastMessage';
import useNoteTaking from '../hooks/useNoteTaking';
import AddNoteButton from '../components/AddNoteButton';
import NoteModal from '../components/NoteModal';
import useNoteFetching from '../hooks/UseNoteFetching';
import NotesUI from '../components/NotesUI';
const VanAi = () => {
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [conversationsLog, setConversationsLog] = useState([]);
    const [sidebarLoading, setSidebarLoading] = useState(true);
    const [sidebarError, setSidebarError] = useState('');
 
    const conversationDivRef = useRef(null);
    const [userHasScrolled, setUserHasScrolled] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
// note-fetching functionality
    const { allNotesTitles, handleNoteItemClick, selectedNoteTitle, selectedNoteContent, showNotes, setShowNotes, noteId, handleNoteUpdate, handleNoteDelete, fetchNoteTitles } = useNoteFetching();
// Note-taking functionality
    const {notes, addNote, highlightPosition, 
        isModalOpen, setIsModalOpen, noteTitle, setNoteTitle, noteContent, setNoteContent, saveNote
             } = useNoteTaking(API_BASE_URL); // Custom hook for note-taking
// Custom hook for handling conversation logic
    const {conversation,setConversation,setCurrentThreadId,error,isLoading,handleSubmitUserMessage
      } = useConversationHandle(API_BASE_URL); 
// Apply syntax highlighting after conversation updates
    const scrollToBottom = () => {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    };
    const bottomRef= useConversationformattingEffect(conversation, userHasScrolled,setUserHasScrolled,scrollToBottom);
    marked.setOptions({
        highlight: function (code, lang) {
            const language = highlightjs.getLanguage(lang) ? lang : 'plaintext';
            return highlightjs.highlight(code, { language }).value;
        },
    });
// Fetch conversations log
    const fetchConversationsLog = useCallback(async () => {
        setSidebarLoading(true);
        try {
            const conversationlog= await retrievePastMessage(navigate);
            setConversationsLog(conversationlog);
        } catch (err) {
            setSidebarError(err.message);
        } finally {
            setSidebarLoading(false);
        }
    }, [navigate]);
// Fetch conversations on component mount (login)
    useEffect(() => {
        fetchConversationsLog();
    }, [fetchConversationsLog]);

    const createNewChat = useCallback(() => {
        setConversation([]);
        setShowSuggestions(true);
        //setNextSuggestions([]);
        setCurrentThreadId(null);
        setShowSidebar(false);
        // Fetch the updated conversations
        fetchConversationsLog();
    }, [fetchConversationsLog, setCurrentThreadId, setConversation]);
    
    const handleSuggestionClick = (suggestion) => {
        setShowSuggestions(false);
        const plainTextSuggestion = stripHtmlTags(suggestion);
        handleSubmitUserMessage(plainTextSuggestion, null);
    };
// Function to toggle the sidebar
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };
// Function to handle conversation log click
    const handleConversationClick = (thread_id, conversation_log) => {
        // Parse the conversation log and set it to the conversation state
        const parsedConversation = conversation_log.slice().reverse().map((msg) => {
            const [type, ...contentArray] = msg.split(': ');
            let preContent=contentArray.join(': ');
            const content = marked(preContent);
            return { type: type.trim().toLowerCase(), content };
        });
        setConversation(parsedConversation);
        setShowSidebar(false); // Optionally close the sidebar
        setCurrentThreadId(thread_id);
        setShowSuggestions(false);
    };
    const handleFormUISubmit = (e, question, imageInput) => {
        e.preventDefault();
        handleSubmitUserMessage(question, imageInput);
        setShowSuggestions(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
  
   const handleOnAddNoteClick = () => {
        addNote();
        setIsModalOpen(true);
        console.log("Note added:", notes);
    }
    const handleCloseNote = () => {
        setShowNotes(false);
    };

    return (
        <div className={`vanAi-container ${showSidebar ? 'sidebar-open' : ''}`}>
            <AppNavbar toggleSidebar={toggleSidebar} showSidebar={showSidebar}/>
            <ChatLogSideBarUI
                showSidebar={showSidebar}
                toggleSidebar={toggleSidebar}
                createNewChat={createNewChat}
                handleConversationClick={handleConversationClick}
                conversations={conversationsLog}
                sidebarLoading={sidebarLoading}
                sidebarError={sidebarError}
                allNoteTitles={allNotesTitles}
                handleNoteItemClick={handleNoteItemClick}
                handleNoteDelete={handleNoteDelete}
            />
            <div className="vanAi-content">
                <div className="conversation-container" id="conversation" ref={conversationDivRef} style={{ marginBottom: "60px" }}>
                    <MessageUI conversation={conversation} />
                    {showSuggestions && <ShowInitialSuggestion handleSuggestionClick={handleSuggestionClick} />}
                    {error && <div className="error-message">{error}</div>}
                    <div ref={bottomRef} />
                </div>
                <AddNoteButton position={highlightPosition} onAddNote={handleOnAddNoteClick} />
                <NoteModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    noteTitle={noteTitle}
                    setNoteTitle={setNoteTitle}
                    noteContent={noteContent}
                    setNoteContent={setNoteContent}
                    onSave={saveNote}
                    fetchNoteTitles={fetchNoteTitles}
                />
                 <FormUI
                        handleSubmit={handleFormUISubmit}
                        isLoading={isLoading}/>
            </div>
            
                { selectedNoteTitle && selectedNoteContent && showNotes && ( 
                
                    <NotesUI noteTitle={selectedNoteTitle} noteContent={selectedNoteContent} onClose={handleCloseNote} handleNoteUpdate={handleNoteUpdate} noteId={noteId}/> 
                    
                   )}
            <div ref={bottomRef} />
        </div>
    );
};
export default VanAi;
