import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';

const Track = ({ track, index }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [currentAudio, setCurrentAudio] = useState(null);

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

  const playAudio = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.play();
      setCurrentAudio(wavesurferRef.current);
    }
  }, []);

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'lightskyblue',
      progressColor: 'lightslategray',
      cursorColor: 'rgba(0,0,0,0)',
    });
    wavesurferRef.current.load(`https://thz.fm${track.attach_mp3}`);
    wavesurferRef.current.on('ready', function() {
      if (index === 0) {
        wavesurferRef.current.pause();
      }
    });
    wavesurferRef.current.on('audioprocess', function() {
      var currentTime = wavesurferRef.current.getCurrentTime();
      var duration = wavesurferRef.current.getDuration();
      updateTimer(currentTime, duration);
    });
    return () => {
      wavesurferRef.current && wavesurferRef.current.destroy();
    };
  }, [track, index, playAudio]);

  return (
    <div key={index}>
      <p>{track.title}</p>
      <p>{track.artist}</p>
      <div id={`waveform-${index}`} ref={waveformRef}></div>
      <button onClick={playAudio}>Play</button>
    </div>
  );
}

const Release = () => {
  const { title } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title);

  if (isValidating) {
    return <>Loading...</>
  }

  if (error) {
    return <>{JSON.stringify(error)}</>
  }

  if (data) {
    return (
      <div>
        {/* Display the data */}
        <div className="album-page" style={{backgroundImage: `url(${data.release_artwork})`}}>
          <div className="album-page-text">
            <h1>{data.title}</h1>
            <p>{data.release_artist}</p>
            <p>{data.release_date}</p>
            <p>{data.release_label}</p>
            <p>{data.release_description}</p>
            <p>{data.release_credits}</p>
            {data.release_tracks.map((track, index) => (
              <Track track={track} index={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null;
};

export default Release;
