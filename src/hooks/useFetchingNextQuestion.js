import {useState, useCallback} from 'react';



const useFetchingNextQuestion = (conversation, API_BASE_URL) => {
    const [nextSuggestions, setNextSuggestions] = useState(null);

    const fetchNextSuggestions = useCallback( async () => {
        if (conversation.length === 0) return;
        console.log('Fetching next suggestions...');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text_response: conversation }),
            });
            
            if (!response.ok) {
                throw new Error(response.error || 'Failed to fetch suggestions');
            }
            const responseData = await response.json();
            setNextSuggestions(responseData);
        } catch (error) {
            console.error('Error fetching next suggestions:', error);
        }


    }, [API_BASE_URL,conversation]);

    return {
        nextSuggestions,
        setNextSuggestions,
        fetchNextSuggestions,
    };
};
export default useFetchingNextQuestion;