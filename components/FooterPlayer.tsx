import React from 'react';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import './component_styles/FooterPlayer.css';

const FooterPlayer = ({ track, playing, togglePlayPause, onPrev, onNext, progressPercentage }) => {
    return (
    <div className="footer-player">
      <div className="album-art">
        <img src={track?.cover_art_url} alt={track?.name} />
      </div>
      <div className="track-details">
        <span className="track-name">{track?.name}</span>
        <span className="track-artist">{track?.artist}</span>
        <span className="track-album">{track?.album}</span>
      </div>
      <div className="player-controls">
        <button className="control-button" onClick={onPrev}>
          <FaBackward />
        </button>
        <button className="control-button" onClick={togglePlayPause}>{playing ? <FaPause /> : <FaPlay />}</button>
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