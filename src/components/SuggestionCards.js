// src/components/SuggestionCard.js

import React from 'react';
import './SuggestionCards.css'; // Create and style this CSS file as needed
import Card from 'react-bootstrap/Card';

const SuggestionCard = ({ suggestion, onClick }) => {
    return (
        <Card className="suggestion-card" onClick={() => onClick(suggestion)}>
            <Card.Body>
                <Card.Text>{suggestion}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default SuggestionCard;
