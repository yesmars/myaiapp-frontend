import React from 'react';
import { MdDelete } from "react-icons/md";

import './Notesbar.css';
const Notesbar = ({ allNoteTitles, handleNoteItemClick, handleNoteDelete }) => {
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
                                <span className='note-bar-item'>{note.title}</span>
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