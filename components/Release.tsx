import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';

const Track = ({ track, index }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatTime = (seconds) => {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
  };

  const updateTimer = (currentTime, duration) => {
    var currentTimeFormatted = formatTime(currentTime);
    var durationFormatted = formatTime(duration);
    var timerElement = document.getElementById('timer-' + index);
    timerElement.textContent = currentTimeFormatted + ' / ' + durationFormatted;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'lightskyblue',
      progressColor: 'lightslategray',
      cursorColor: 'rgba(0,0,0,0)',
    });
    wavesurferRef.current.on('audioprocess', function() {
      var currentTime = wavesurferRef.current.getCurrentTime();
      var duration = wavesurferRef.current.getDuration();
      updateTimer(currentTime, duration);
    });
    return () => {
      wavesurferRef.current && wavesurferRef.current.destroy();
    };
  }, [index]);

  useEffect(() => {
    wavesurferRef.current.load(`https://thz.fm${track.attach_mp3}`)
      .catch(error => console.error(`Error loading audio file: ${error}`));
  }, [track]);

  return (
    <div className="tracklist" key={index}>
      <div className="track-items" key={index}>
      <p>{track.track_title}</p>
      <p>by {track.track_artist}</p>
      </div>
      <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div className="waveform" id={`waveform-${index}`} ref={waveformRef}></div>
      
      <span id={`timer-${index}`}></span>
    </div>
  );
}


const Release = () => {
  const { title } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title);

  if (data) {
    return (
      <div>
        {/* Display the data */}
        <div className="album-page" style={{backgroundImage: `url(${data.release_artwork})`}}>
          <div className="album-page-text">
            <h1>{data.title}</h1>
            <p>By: {data.release_artist}</p>
            <p>Released On: {data.release_date}</p>
            <p>Label: {data.release_label}</p>
            <p>Price USD: $ {data.price_usd} USD</p>
            <p>Price ERG: ∑ {data.price_erg} ERG</p>
            <p>{data.release_description}</p>
            <p>Genres:</p>
            {Array.isArray(data.release_genres) && data.release_genres.map((genre, index) => (
                <p key={index}>{genre.genre}</p>
              ))}
              <p>Credits:</p>
              {Array.isArray(data.release_credits) && data.release_credits.map((credit, index) => (
                <p key={index}>{credit.credit_type}: {credit.name__title}</p>
              ))}
              <p>Tracks:</p>
              {Array.isArray(data.release_tracks) && data.release_tracks.map((track, index) => (
                <Track track={track} index={index} key={index} />
              ))}
          </div>
        </div>
      </div>
    )
  }

  return null;
};

export default Release;
