import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import Base64AudioPlayer from "./b64audio";
import { IoSend, IoMic, IoStop, IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";

const PronunciationUi = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [word, setWord] = useState("");
  const [audio, setAudio] = useState("");
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(""); // State for the recorded audio URL
  const[userPronunciation,setUserPronunciation]=useState(""); 
  const [error, setError] = useState("");
  const [feedBack, setFeedBack] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (word.trim() === "") {
      setError("Please enter a word.");
      return;
    }

    setAudio("");
    setError("");
    setRecordedAudioUrl("");
    setFeedBack("");
    setUserPronunciation("");
    try {
      const response = await axios.post(
        `${API_BASE_URL}/pronunciation_ui`,
        { word },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data.success) {
        setAudio(response.data.audio);
        setError('');
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();  // Automatically play the audio when it's updated
    }
  }, [audio]);  // This effect runs whenever the audio state changes


  //step 2
  const startRecording = () => {
    if (!word.trim()) {
      setError("Please submit a word and listen to its pronunciation before recording.");
      return;
    }
    setError("");
    setFeedBack("");
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        mediaRecorderRef.current.ondataavailable = event => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = handleRecordingStop;
        mediaRecorderRef.current.start();
        setIsRecording(true);
      })
      .catch(err => {
        setError("Failed to access microphone: " + err.message);
      });
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleRecordingStop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    audioChunksRef.current = [];
    const audioUrl = URL.createObjectURL(audioBlob);
    setRecordedAudioUrl(audioUrl);

    // Log the URL to verify it's being created correctly
    console.log("Recorded Audio URL:", audioUrl);

    sendAudioToBackend(audioBlob);
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('word', word);
    try {
      const response = await axios.post(`${API_BASE_URL}/pronunciation_feedback`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setFeedBack(response.data.feedback);
        setUserPronunciation(response.data.user_pronunciation);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (recordedAudioUrl && audioRef.current) {
      audioRef.current.load(); // Ensure the audio element is updated
      audioRef.current.play().catch(error => {
        console.error("Error playing recorded audio:", error);
      });
    }
  }, [recordedAudioUrl]);

  return (
    <>
      <div>
        <h1>Pronunciation</h1>
      </div>
      <div>
        {audio && <p>AI pronunciation for the word: "{word}"</p>}
        {audio &&(
          
        <Base64AudioPlayer base64String={audio} audioRef={audioRef} />)}
      </div>
      <div>
        {recordedAudioUrl && <p>Your pronunciation of the word: "{word}"</p>}
        {recordedAudioUrl && (
          <audio ref={audioRef} controls>
            <source src={recordedAudioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            id="word"
            name="word"
            value={word}
            placeholder="Enter a word"
            onChange={(e) => setWord(e.target.value)}
          />
          <button type="submit"><IoSend /></button>
        </form>
      </div>
      <div>
        { audio &&(
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? <IoStop /> : <IoMic />}
          {isRecording ? " Done and check" : " Pronounce the word"}
        </button>)}

        <div>
          {feedBack && (
            <p>
              {feedBack === "Correct Pronunciation" ? (
                <span style={{ color: 'green' }}>
                  <IoCheckmarkCircleSharp /> {feedBack}
                </span>
              ) : (
                <span style={{ color: 'red' }}>
                  <IoCloseCircleSharp /> {feedBack}
                </span>
              )}
            </p>
          )}
          {feedBack==="Incorrect Pronunciation" && (
            <p>
              what you need to say is : {word}
            </p>
          )}
          {feedBack==="Incorrect Pronunciation" && (
            <p>
              what you might have said is : {userPronunciation}
            </p>)}
        </div>
      </div>
      <div>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default PronunciationUi;

