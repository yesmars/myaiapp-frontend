import { selectHighLightedText } from "../utilityFunction/selectHighLightedText";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const useNoteTaking = (API_BASE_URL) => {
    const [notes, setNotes] = useState([]);
    const [highlightPosition, setHighlightPosition] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const navigate = useNavigate();
// Function to select highlighted text
    const addNote = () => {
        const highlightedText = selectHighLightedText();
        if (highlightedText) {
            setNotes(highlightedText);
            setHighlightPosition(null);
        }
        
    };
// Function to save the note
    const saveNote = async (fetchNoteTitles) => {
        if (noteTitle && noteContent) {
            setNotes(  { title: noteTitle, content: noteContent });
            setIsModalOpen(false);
            setNoteTitle("");
            setNoteContent("");
        }
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const sendNote = await axios.post(`${API_BASE_URL}/notes`,{
                title: noteTitle,
                content: noteContent
            }, {
               
                headers: {'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}` },
            });
            if (sendNote.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                
                return;
            }
            await fetchNoteTitles();
            const noteStatus= sendNote.data.message;
            console.log(' note status', noteStatus);
        
            

        }catch(error){
            console.error("Error saving note:", error);
        }
    };
// Function to handle mouse up and touch end events
const handleMouseUpOrTouchEnd = useCallback( (event) => {
    const highlightedText = selectHighLightedText();
    if (highlightedText) {
        const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        setHighlightPosition({ top: rect.bottom, left: rect.left });
        console.log('highlighted position', highlightPosition);
    } else {
        setHighlightPosition(null);
    }
}, [highlightPosition]);

// Add event listeners for both mouseup and touchend
useEffect(() => {
    document.addEventListener('mouseup', handleMouseUpOrTouchEnd);
    document.addEventListener('touchend', handleMouseUpOrTouchEnd);

    // Cleanup event listeners on component unmount
    return () => {
        document.removeEventListener('mouseup', handleMouseUpOrTouchEnd);
        document.removeEventListener('touchend', handleMouseUpOrTouchEnd);
    };
}, [handleMouseUpOrTouchEnd]);

// Update note content when modal opens
    useEffect(() => {
        if (isModalOpen) {
            const highlightedText = selectHighLightedText();
            setNoteContent(highlightedText);
        }
    }, [isModalOpen]);


    return { notes, addNote, highlightPosition, handleMouseUpOrTouchEnd, isModalOpen, setIsModalOpen, noteTitle, setNoteTitle, noteContent, setNoteContent, saveNote };
}

export default useNoteTaking;