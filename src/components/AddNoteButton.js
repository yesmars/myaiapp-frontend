import React from 'react';
import './AddNoteButton.css';

const AddNoteButton = ({position, onAddNote }) => {
    if(!position) return null;
    const style = {
        position: 'absolute',
        top: position.top + window.scrollY,
        left: position.left + window.scrollX,
    };

    return (
        <button className='add-note-button' style={style} onClick={onAddNote}>
            Add Note
        </button>
    );
}

export default AddNoteButton;