import React from 'react';
import './SuggestionCards.css';
import SuggestionCard from './SuggestionCards';
import { marked } from 'marked';
import parse from 'html-react-parser';

const ShowAfterResponseSuggestion = ({ nextSuggestions, handleSuggestionClick }) => {

    return (
        <div className="nextSuggestions-container">
                            <div className="suggestions">
                                {nextSuggestions.map((suggestion, index) => (
                                    <SuggestionCard key={index} suggestion={parse(marked(suggestion))} onClick={() => handleSuggestionClick(suggestion)} />
                                ))}
                            </div>
                        </div>
    )



}

export default ShowAfterResponseSuggestion;