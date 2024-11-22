import React from 'react';
import './NoteModal.css';

const NoteModal = ({ isOpen, onClose, noteTitle, setNoteTitle, noteContent, setNoteContent, onSave, fetchNoteTitles }) => {
    if (!isOpen) return null;
    const handleSave = () => {
        onSave( fetchNoteTitles);
      
    }
// Modal structure
    return (
        <div className="note-modal-overlay">
            <div className="note-modal">
                <div className="note-modal-header">
                    <h2>Add Note</h2>
                    <button className="close-button" onClick={onClose}>X</button>
                </div>
                <div className="note-modal-body">
                    <input
                        type="text"
                        placeholder="Note Title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        className="note-title-input"
                    />
                    <textarea
                        placeholder="Note Content"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="note-content-textarea"
                    />
                </div>
                <div className="note-modal-footer">
                    <button className="save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default NoteModal;