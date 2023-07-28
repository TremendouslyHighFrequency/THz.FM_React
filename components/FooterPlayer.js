// FooterPlayer component
import React from 'react';

const FooterPlayer = ({ track, albumArtwork, currentTime, duration }) => {
  const percentage = (currentTime / duration) * 100;

  if (!track) {
    return null;
  }

  return (
    <div className="footer-player">
      <img className="player-art" src={`https://thz.fm${albumArtwork}`} alt={track.track_title} /> 
      <div className="track-details">
        <h2>{track.track_title}</h2>
        <p>{track.track_artist}</p>
      </div>
      <ProgressBar now={percentage} />
    </div>
  );
};