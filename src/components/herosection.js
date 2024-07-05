import React from 'react';
import './herosection.css';
import { useNavigate } from 'react-router-dom'; // Only if using React Router

const HeroSection = () => {
  let navigate = useNavigate(); // Use only if using React Router

  return (
    <>
      <div className="hero-section" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/aiGodess.png)` }}>
        <h1 className="hero-text">Welcome to Our VAN-AI</h1>
        <div className="hero-buttons">
          <button className='login-button'onClick={() => navigate('/login')}>Login</button>
          <button className='signup-button'onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
       {/* video back ground  */}
      <div className='hero-section'>
      <video autoPlay muted loop className="hero-video">
        <source src={`${process.env.PUBLIC_URL}/videos/cybergold.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1 className="hero-text">Welcome to Our VAN-AI</h1>
      <div className="hero-buttons">
        <button className='login-button' onClick={() => navigate('/login')}>Login</button>
        <button className='signup-button' onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
      </div>
    </>
  );
}

export default HeroSection;

