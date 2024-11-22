import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const retrievePastMessage = async (navigate) => {
    
    const token = localStorage.getItem('token');
    if (!token) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('User not authenticated');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/retrieve-message`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.data.length === 0) {
            throw new Error('No conversation log found');
        }  
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error);
        } else {
            throw new Error('An error occurred. Please try again.');
        }
       
    }
}