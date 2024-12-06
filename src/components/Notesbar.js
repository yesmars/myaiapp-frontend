import React from 'react';
import { MdDelete } from "react-icons/md";

import './Notesbar.css';
const Notesbar = ({ allNoteTitles, handleNoteItemClick, handleNoteDelete }) => {
    console.log("allNoteTitles :", allNoteTitles);
    return (
        <>
            <div className='note-bar-title'>
                <h1>Notes List</h1>
            </div>
            <div >
                <ul>
                    {allNoteTitles.map((note) => {
                       
                        return (
                            <>
                            <li key={note.note_id} onClick={() => handleNoteItemClick(note)}>
                                <div className='note-container'>
                                <div className='note-content'>
                                    <span className='note-bar-item'>{note.title}</span>
                                    <span className='note-timestamp'>{note.timestamp}</span>
                                </div>
                                <button  className='note-bar-delete' onClick={()=>handleNoteDelete(note)} ><MdDelete /></button>
                                </div>
                            </li>
                            </>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};

export default Notesbar;