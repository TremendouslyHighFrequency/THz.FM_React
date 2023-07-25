import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';

const Track = ({ track, index, playAudio }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'lightskyblue',
      progressColor: 'lightslategray',
      cursorColor: 'rgba(0,0,0,0)',
      height: 88,
    });
    wavesurferRef.current.load(`https://thz.fm${track.attach_mp3}`);
    wavesurferRef.current.on('ready', function() {
      if (index === 0) {
        wavesurferRef.current.pause();
      }
    });
    return () => {
      wavesurferRef.current.destroy();
    };
  }, [track]);

  useEffect(() => {
    playAudio(index, wavesurferRef.current);
  }, [playAudio]);

  return (
    <div key={index}>
      <p>{track.title}</p>
      <p>{track.artist}</p>
      <div id={`waveform-${index}`} ref={waveformRef}></div>
      <audio id={`audio-${index}`} crossOrigin src={`https://thz.fm${track.attach_mp3}`} type="audio/mpeg"></audio>
    </div>
  );
}

const Release = () => {
  const { title } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title);

  const [currentAudio, setCurrentAudio] = useState(null);
  const [wavesurfers, setWavesurfers] = useState([]);

  const playAudio = (index, wavesurfer) => {
    stopAudio(); // Stop currently playing audio, if any

  var wavesurfer = wavesurfers[index - 1];
  wavesurfer.on('finish', function() {
    // Automatically play the next audio after the current song ends
    var nextIndex = (index % wavesurfers.length) + 1;
    playAudio(nextIndex);
  });
  
  wavesurfer.on('audioprocess', function() {
    var currentTime = wavesurfer.getCurrentTime();
    var duration = wavesurfer.getDuration();
    updateTimer(currentTime, duration, index); // Pass the index to updateTimer
  });
  
  wavesurfer.play();
  currentAudio = wavesurfer;

  };

  // other functions for stopAudio, pauseAudio, resumeAudio, nextAudio, previousAudio
  function stopAudio() {
    if (currentAudio) {
      currentAudio.stop();
      currentAudio.un('finish'); // Remove the 'finish' event listener
      currentAudio = null;
    }
  }
  
  function pauseAudio() {
    if (currentAudio) {
      currentAudio.pause();
    }
  }
  
  function resumeAudio() {
    if (currentAudio) {
      currentAudio.play();
    }
  }
  
  function nextAudio() {
    var currentIndex = wavesurfers.findIndex(function(wavesurfer) {
      return wavesurfer === currentAudio;
    });
    var nextIndex = (currentIndex + 1) % wavesurfers.length;
    playAudio(nextIndex + 1);
  }
  
  function previousAudio() {
    var currentIndex = wavesurfers.findIndex(function(wavesurfer) {
      return wavesurfer === currentAudio;
    });
    var previousIndex = (currentIndex - 1 + wavesurfers.length) % wavesurfers.length;
    playAudio(previousIndex + 1);
  }
  
  function updateTimer(currentTime, duration, index) {
    var currentTimeFormatted = formatTime(currentTime);
    var durationFormatted = formatTime(duration);
    var timerElement = document.getElementById('timer-' + index);
    timerElement.textContent = currentTimeFormatted + ' / ' + durationFormatted;
  }

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
              <Track track={track} index={index} playAudio={playAudio} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null;
};

export default Release;