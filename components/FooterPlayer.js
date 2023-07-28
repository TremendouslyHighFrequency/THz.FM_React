import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const FooterPlayer = ({ track, currentTime, duration }) => {
    const percentage = (currentTime / duration) * 100;
  
    // Check if track is not null before trying to access its properties
    if (!track) {
      return null;
    }
  
    return (
      <div className="footer-player">
        <img src={`https://thz.fm${track.album_artwork}`} alt={track.track_title} />
        <div className="track-details">
          <h2>{track.track_title}</h2>
          <p>{track.track_artist}</p>
        </div>
        <ProgressBar now={percentage} />
      </div>
    );
  };

export default FooterPlayer;
