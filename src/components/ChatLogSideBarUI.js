import React from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { IoCreateOutline } from "react-icons/io5";
import {marked} from 'marked';
import parse from 'html-react-parser';
import Notesbar from './Notesbar';
import './ChatLogSideBarUI.css';
const ChatLogSideBarUI = ({showSidebar,toggleSidebar,createNewChat,handleConversationClick, sidebarLoading,sidebarError,conversations, allNoteTitles, handleNoteItemClick, handleNoteDelete}) => {
    return(
        <div className={`conversation-sidebar ${showSidebar ? 'show' : ''}`}>
                <br />
                
                <br />
                
                <br />
                <div className="sidebar-header" style={{textAlign:"right"}}>
                    <button className="close-sidebar" onClick={toggleSidebar}><IoMdCloseCircle /></button>
                </div>
                <div className='new-chat-button' >
                <button className="new-chat" onClick={() => createNewChat()}><IoCreateOutline /></button>
                </div>
                {sidebarLoading ? (
                    <p>Loading...</p>
                ) : sidebarError ? (
                    <p>{sidebarError}</p>
                ) : (
                    <>
                    <ul className="conversation-list">
                        {conversations.slice().reverse().map(({ summary,thread_id, conversation_log }) => {
                            // Show the first 2 messages and the last message with '...' in between
                            
                            return (
                                <li key={thread_id} className="conversation-item" onClick={() => handleConversationClick(thread_id, conversation_log)}>
                                    <br />
                                    <span style={{ fontWeight: 'bold', textAlign: 'left' }}>{parse(marked(summary))}</span>
                                </li>
                            );
                        })}
                    </ul>
                    <Notesbar allNoteTitles={allNoteTitles} handleNoteItemClick={handleNoteItemClick} handleNoteDelete={handleNoteDelete} />
                    </>
                )}
            </div>


    )};
export default ChatLogSideBarUI;