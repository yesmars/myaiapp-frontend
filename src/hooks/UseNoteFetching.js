import {useState, useEffect, useCallback} from 'react';
import { retrieveNoteTitle } from '../utilityFunction/retreatNotesTitle';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const useNoteFetching = () => {
    const navigate = useNavigate();
    const [allNotesTitles, setAllNotesTitles] = useState([]);
    const [selectedNoteTitle, setSelectedNotesTitle] = useState('');
    const [selectedNoteContent, setSelectedNoteContent] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [noteId, setNoteId] = useState('');
  
    // Separate the fetch function
    const fetchNoteTitles = useCallback(async () => {
        try {
        const titles = await retrieveNoteTitle(navigate);
      
        setAllNotesTitles(titles);
        } catch (error) {
        console.error(error);
        }
    }, [navigate]);


    const handleNoteItemClick = async (note) => {
      
        if (!note) {
            console.error("Note is undefined");
            return;
        }
        const noteId = note.note_id;
        setNoteId(noteId);
        
    
        const notesTitle = note.title;
       

        try {
            const response = await axios.get(`${API_BASE_URL}/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
          
            setSelectedNotesTitle(notesTitle);
            setSelectedNoteContent(response.data.content);
            setShowNotes(true);
           
        } catch (error) {
            console.error(error);
        }
    };

    const handleNoteUpdate = useCallback ( async (noteId, noteTitle, noteContent) => {
        
        try {
            const response = await axios.put(`${API_BASE_URL}/notes/${noteId}`, {
                title: noteTitle,
                content: noteContent,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // After successful update, refresh the notes list
          console.log(" this Note ID:", noteId);
          await fetchNoteTitles();
          await handleNoteItemClick({note_id: noteId, title: noteTitle});
          console.log("Note Updated:", response.data);
          
        } catch (error) {
            console.error(error);
        }
    }, [fetchNoteTitles]);
    useEffect(() => {
       
        fetchNoteTitles();
    }, [fetchNoteTitles]);

    const handleNoteDelete = async (note) => {
        if (!note) {
            console.error("Note is undefined");
            return;
        }
        const noteId = note.note_id;
        console.log("Note ID:", noteId);
        setNoteId(noteId);
        
        try {
            await axios.delete(`${API_BASE_URL}/notes/${noteId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log("Note Deleted:", noteId);
            // After successful deletion, refresh the notes list
            await fetchNoteTitles();
            setShowNotes(false);
        } catch (error) {
            console.error(error);
        }
    }   

    return { allNotesTitles, setAllNotesTitles , handleNoteItemClick, selectedNoteTitle, selectedNoteContent, setSelectedNotesTitle, showNotes, setShowNotes, noteId, handleNoteUpdate, handleNoteDelete, fetchNoteTitles };
}

export default useNoteFetching;