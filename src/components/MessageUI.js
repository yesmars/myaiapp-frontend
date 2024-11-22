import React from "react";
import PronunciationUi from './PronunciationUi';
import parse from 'html-react-parser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './MessageUI.css';


const MessageUI = ({conversation}) => {

    return(
        <>
        {conversation.map((msg,index) => (
            <div key={msg.id || index} className='message-container'>
                <div  className={`${msg.type}-message`}>
                    {msg.type === 'image' ? (
                        <div style={{ display: 'flex', justifyContent:'center', backgroundColor:'beige' }}>
                            <img src={msg.content} alt="User Upload" style={{ width: '50%' }} />
                        </div>
                    ) : msg.type === 'bot' && typeof msg.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
                    ) : msg.type === 'assistant' && typeof msg.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: msg.content }}></div>
                    ) : (parse (marked(DOMPurify.sanitize(msg.content)))

                    )}
                     {msg.ui_code === 'PronunciationUI' && <PronunciationUi />}
                </div>
            </div>
            
        ))}
        </>
    
    )};

export default MessageUI;