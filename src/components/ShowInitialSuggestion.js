import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './SuggestionCards.css';
import SuggestionCard from './SuggestionCards';

const ShowInitialSuggestion = ({ handleSuggestionClick }) => {

    const suggestions = [
        "Tell me a joke.",
        "Create a picture of a cute cat.",
        "Generate an audio of the words 'I love you' in Vietnamese please",
        "I want to practice pronunciation"
    ];

    return (
        
            <Container className='card-container'>
                <Row>
                    {suggestions.map((suggestion, index) => (
                        <Col key={index} md={4}>
                            <SuggestionCard suggestion={suggestion} onClick={handleSuggestionClick} />
                        </Col>
                    ))}
                </Row>
            </Container>
        
    );
};

export default ShowInitialSuggestion;
