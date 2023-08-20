import React from 'react';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './component_styles/FooterPlayer.css';

const FooterPlayer = ({ track, playing, onPlay, onPrev, onNext, progressPercentage }) => {
    return (
    <div className="footerPlayer">
      <div className="track-details">

      </div>
      <div className="player-controls">
        <button className="control-button" onClick={onPrev}>
          <FaBackward />
        </button>
        <button className="control-button" onClick={onPlay}>
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <button className="control-button" onClick={onNext}>
          <FaForward />
        </button>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
      </div>
    </div>
  );
};
 export default FooterPlayer;