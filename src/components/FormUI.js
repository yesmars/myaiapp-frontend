import React from "react";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { FaFileCirclePlus } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { useRef } from "react";
import './FormUI.css';
const FormUI = ({handleSubmit, isLoading}) => {
    const [question, setQuestion] = useState('');
    const [imageInput, setImageInput] = useState(null);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageInput(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); // Set the preview here
                setQuestion(question);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTextAreaInput = (e) => {
        setQuestion(e.target.value);
        // Adjust textarea height automatically
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
    };

    const handleRemoveImage = () => {
        setImageInput(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFormUiSubmit = (e) => {
        handleSubmit(e,question, imageInput);
        setQuestion('');
        setImageInput(null);
        setImagePreview('');
      
    }

    return (
        <Form onSubmit={(e)=>handleFormUiSubmit(e) }  encType="multipart/form-data">
        <div className='input-container'>
                <div className='control-image'>
                {imagePreview && (
                    <div className="image-preview">
                        <div className='image-itself'>
                        <img src={imagePreview} alt="Selected" style={{ width: '100px', height: 'auto', margin: '10px 0' }} />
                        </div>
                        <button type="button" className="remove-image" onClick={handleRemoveImage}>X</button>
                    </div>
                )}
                </div>
        <div className='file-text-button'>
                
            <div className="input-group">
                <div className='button-wrapper'>
                    <div className='plus-button'>
                    <label htmlFor="imageInput" className="file-input-label"><FaFileCirclePlus /></label>
                    </div>
                </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        id="imageInput"
                        name="imageInput"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <div className='text-area'>
                    <textarea
                        id="question"
                        name="question"
                        className="input-field"
                        value={question}
                        onChange={handleTextAreaInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleFormUiSubmit(e);
                            }
                        }}
                        placeholder="Ask something..."
                        rows={1}
                        disabled={isLoading}
                    />
                </div>
                    <div className='button-control'>
                    <Button type="submit" id="submit-button" className="submit-button">
                        <IoSend />
                    </Button>
                    </div>
                </div>
            </div>    
        </div>
    </Form>

    )}

export default FormUI;