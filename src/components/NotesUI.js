import React, { useState, useEffect, useRef, useCallback } from 'react';
import './NotesUI.css';
import { IoMdCloseCircle } from 'react-icons/io';

const NotesUI = ({ noteTitle, noteContent, onClose, handleNoteUpdate, noteId }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(noteTitle);
  const [editedContent, setEditedContent] = useState(noteContent);
  const noteRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  // Initialize position on mount to prevent jumping
  useEffect(() => {
    if (noteRef.current) {
      setPosition({
        x: window.innerWidth * 0.7, // Position it on the right side initially
        y: 100 // Some offset from top
      });
    }
  }, []);

  const handleMouseDown = (e) => {
    if (noteRef.current) {
      const rect = noteRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback( (e) => {
    if (isDragging) {
      e.preventDefault();
      const newX = e.clientX - offsetRef.current.x;
      const newY = e.clientY - offsetRef.current.y;
      
      // Ensure the note stays within viewport bounds
      const maxX = window.innerWidth - (noteRef.current?.offsetWidth || 0);
      const maxY = window.innerHeight - (noteRef.current?.offsetHeight || 0);
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };
// Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };
// Handle save button click
  const handleSaveClick = () => {
    handleNoteUpdate(noteId, editedTitle, editedContent);
    setIsEditing(false);
    
  };
// Handle title change
  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
    
  };
// Handle content change
  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  
  };
    // Handle close button click
  const handleClose = (e) => {
    e.stopPropagation(); // Prevent drag event from firing
    if (onClose) {
      onClose();
    }
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  // add touch handle for mobile
  useEffect(() => {
    const currentNoteRef = noteRef.current;
  
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      const rect = currentNoteRef.getBoundingClientRect();
      offsetRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      setIsDragging(true);
    };
  
    const handleTouchMove = (e) => {
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        const newX = touch.clientX - offsetRef.current.x;
        const newY = touch.clientY - offsetRef.current.y;
  
        const maxX = window.innerWidth - (currentNoteRef?.offsetWidth || 0);
        const maxY = window.innerHeight - (currentNoteRef?.offsetHeight || 0);
  
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };
  
    const handleTouchEnd = () => {
      setIsDragging(false);
    };
  
    currentNoteRef.addEventListener('touchstart', handleTouchStart);
    currentNoteRef.addEventListener('touchmove', handleTouchMove);
    currentNoteRef.addEventListener('touchend', handleTouchEnd);
  
    return () => {
      currentNoteRef.removeEventListener('touchstart', handleTouchStart);
      currentNoteRef.removeEventListener('touchmove', handleTouchMove);
      currentNoteRef.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={noteRef}
      className={`notes-ui ${isDragging ? 'dragging' : ''}`}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        userSelect: 'none'
      }}
    >
      {/* Drag handle */}
      <div 
        className="notes-ui-handle"
        onMouseDown={handleMouseDown}
      >
        <div className="notes-ui-handle-bar" />
        <button 
          className="notes-ui-close"
          onClick={handleClose}
          aria-label="Close note"
        >
            <IoMdCloseCircle />
        </button>
      </div>

      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            className="notes-ui-title-input"
          />
          <textarea
            value={editedContent}
            onChange={handleContentChange}
            className="notes-ui-content-textarea"
          />
          <button onClick={handleSaveClick} className="save-button">Save</button>
        </>
      ) : (
        <>
        <div className='note-box'>
          <h2 className="notes-ui-title">{noteTitle}</h2>
          <p className="notes-ui-text">{noteContent}</p>
          <button onClick={handleEditClick} className="edit-button">Edit</button>
        </div>
        </>
      )}
    </div>
  );
};

export default NotesUI;