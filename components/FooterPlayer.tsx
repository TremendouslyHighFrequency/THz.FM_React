import React from 'react';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './component_styles/FooterPlayer.css';

const FooterPlayer = ({ track, playing, onPlay, onPrev, onNext, progressPercentage }) => {
    return (
    <div className="footerPlayer">
      <div className="track-details">

      </div>
      <div className="player-controls">
  
      
       
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <button className="control-button" onClick={onPrev}>
          <FaBackward />
        </button>
      <button className="control-button float-right" onClick={onNext}>
          <FaForward />
        </button>

    </div>
  );
};
 export default FooterPlayer;