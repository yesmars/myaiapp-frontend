import React, { useState, useRef,useEffect } from "react";
import axios from "axios";
import Base64AudioPlayer from "./b64audio";
import { IoSend, IoMic, IoStop, IoCheckmarkCircleSharp, IoCloseCircleSharp } from "react-icons/io5";
import './PronunciationUi.css';
import { RiSpeakLine } from "react-icons/ri";
import RecordRTC from 'recordrtc';

const PronunciationUi = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [word, setWord] = useState("");
  const [audio, setAudio] = useState("");
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(""); // State for the recorded audio URL
  const[userPronunciation,setUserPronunciation]=useState(""); 
  const[score,setScore]=useState(""); // State for the recorded audio URL
  const [error, setError] = useState("");
  const [feedBack, setFeedBack] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const audioRef = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (word.trim() === "") {
      setError("Please enter a word.");
      return;
    }
    setLoading(true);
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
    setLoading(false);
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
        const newRecorder = RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm',
          recorderType: RecordRTC.StereoAudioRecorder,
          numberOfAudioChannels: 1,
          desiredSampRate: 16000,
        });
        newRecorder.startRecording();
        setRecorder(newRecorder);
        setIsRecording(true);
      })
      .catch(err => {
        setError("Failed to access microphone: " + err.message);
      });
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        sendAudioToBackend(blob);
        setIsRecording(false);
      });
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('word', word);
    setLoading(true);
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
        setRecordedAudioUrl(response.data.encoded_audio);
        setScore(response.data.score);
        console.log('encoded audio:',response.data.encoded_audio);
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
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
    <div className="pronunciation">
      <div className="title">
        <h1>Pronunciation</h1>
      </div>
      <div className="both-audio">
          <div className="AI-audio">
            {audio && <p>Van AI <RiSpeakLine /> : "{word}"</p>}
            {audio &&(
              
            <Base64AudioPlayer base64String={audio} audioRef={audioRef} />)}
          </div>
          <div className="user-audio">
            {recordedAudioUrl && <p>You <RiSpeakLine />: "{word}"</p>}
            {recordedAudioUrl && (
            <Base64AudioPlayer className='user-audio-play' base64String={recordedAudioUrl} audioRef={audioRef} />
            )}
          </div>
      </div>
      <div className="input-button">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            id="word"
            name="word"
            value={word}
            placeholder="Enter a word"
            onChange={(e) => setWord(e.target.value)}
          />
          <button type="submit" disabled={loading}><IoSend /></button>
        </form>
      </div>
      <div>

          <div className="record-button">
          { audio &&(
          <button className="record" disabled={loading} onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? <IoStop /> : <IoMic />}
            {isRecording ? " Done and check" : " Pronounce the word"}
          </button>)}
          </div>

        <div>
          <div className="feedback">
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
          </div>
          <div className="feedback">
          {feedBack==="Incorrect Pronunciation" && (
            <p>
              what you need to say is : {word}
            </p>
          )}
          </div>
          <div className="feedback">
          {feedBack==="Incorrect Pronunciation" && (
            <p>
              what you might have said is : {userPronunciation}
            </p>)}
          </div>
          <div className="score">
          {feedBack && (
            <p>
              Your score is : {score}
            </p>)}
          </div>
        </div>
      </div>
      <div>
        {error && <p>{error}</p>}
      </div>
    </div>
    </>
  );
};

export default PronunciationUi;

