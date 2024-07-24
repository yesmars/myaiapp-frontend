import React from 'react';
import './herosection.css';
import { useNavigate } from 'react-router-dom'; // Only if using React Router

const HeroSection = () => {
  let navigate = useNavigate(); // Use only if using React Router

  return (
    <>
      
      <div className="hero-section" /*style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/aiGodess.png)` }} */>
      <div className="logo-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={`${process.env.PUBLIC_URL}/images/Olivia.svg`} alt="Logo" style={{ position: 'absolute', top: '5%', width: '30%', height: '30%' }}/>
      </div>
      <div className='parent-div'>
  
        <div className='joke'>
          <p>
            Tell me a joke.
            <br />
            Why can't you give Elsa a balloon?
            <br />
            Because she will let it go!
            
          </p>
        </div>
        <div className="hero-buttons">
          <button className='login-button'onClick={() => navigate('/login')}>Get Started Here</button>
          {/*<button className='signup-button'onClick={() => navigate('/signup')}>Sign Up</button>*/}
        </div>
        <div className='catpic'>
          <p>
            create a picture of a cute cat:
            <br />
            <img src={`${process.env.PUBLIC_URL}/images/cutecat.jpg`} alt="Cat" style={{ width: '150px', height: '150px', padding:'5%',backgroundColor:'#e0e0de'}} />
          </p>
        </div>
      </div>
    </div>
      
      
       {/* video back ground  */}
      {/*<div className='hero-section'>
      <video autoPlay muted loop className="hero-video">
        <source src={`${process.env.PUBLIC_URL}/videos/cybergold.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h1 className="hero-text">Welcome to Our VAN-AI</h1>
      <div className="hero-buttons">
        <button className='login-button' onClick={() => navigate('/login')}>Login</button>
        <button className='signup-button' onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
  </div>*/}
    </>
  );
}

export default HeroSection;

