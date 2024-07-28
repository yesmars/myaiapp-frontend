import React from 'react';

const Base64AudioPlayer = ({ base64String }) => {
    if (!base64String) {
        return null;
    }

    const audioStyle = {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        padding: '10px',
    };

    return (
        <audio controls style={audioStyle}>
            <source src={`data:audio/mpeg;base64,${base64String}`} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
    );
};

export default Base64AudioPlayer;
