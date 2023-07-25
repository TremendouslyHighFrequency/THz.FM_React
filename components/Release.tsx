import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';

function Track({ track, index }) {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'lightskyblue',
      progressColor: 'lightslategray',
      cursorColor: 'rgba(0,0,0,0)',
      height: 88
    });
    wavesurferRef.current.load(track.attach_mp3);
    return () => wavesurferRef.current.destroy();
  }, [track]);

  const formatTime = (seconds) => {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
  };

  const updateTimer = (currentTime, duration, index) => {
    var currentTimeFormatted = formatTime(currentTime);
    var durationFormatted = formatTime(duration);
    var timerElement = document.getElementById('timer-' + index);
    timerElement.textContent = currentTimeFormatted + ' / ' + durationFormatted;
  };

  const playAudio = (index) => {
    stopAudio();

    var wavesurfer = wavesurfers[index];
    wavesurfer.on('finish', function() {
      var nextIndex = (index + 1) % wavesurfers.length;
      playAudio(nextIndex);
    });

    wavesurfer.on('audioprocess', function() {
      var currentTime = wavesurfer.getCurrentTime();
      var duration = wavesurfer.getDuration();
      updateTimer(currentTime, duration, index);
    });

    wavesurfer.play();
    setCurrentAudio(wavesurfer);
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.stop();
      currentAudio.un('finish');
      setCurrentAudio(null);
    }
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
    }
  };

  const resumeAudio = () => {
    if (currentAudio) {
      currentAudio.play();
    }
  };

  const nextAudio = () => {
    var currentIndex = wavesurfers.findIndex((wavesurfer) => {
      return wavesurfer === currentAudio;
    });
    var nextIndex = (currentIndex + 1) % wavesurfers.length;
    playAudio(nextIndex);
  };

  const previousAudio = () => {
    var currentIndex = wavesurfers.findIndex((wavesurfer) => {
      return wavesurfer === currentAudio;
    });
    var previousIndex = (currentIndex - 1 + wavesurfers.length) % wavesurfers.length;
    playAudio(previousIndex);
  };

  if (isValidating) {
    return <>Loading...</>
  }

  if (error) {
    return <>{JSON.stringify(error)}</>
  }

  if (data) {
    return (
      <div>
        <p>{track.title}</p>
        <p>{track.artist}</p>
        <div className="audio-controls-container">
          <div id={`timer-${index}`}></div>
          <div className="audio-controls">
            <audio id={`audio-${index}`} crossorigin src={track.attach_mp3} type="audio/mpeg"></audio>
            <div className="waveform" ref={waveformRef}></div>
            <div className="buttons">
              <button id="playButton" onClick={play}>Play</button>
              <button onClick={pause}>Pause</button>
              {/* other buttons */}
            </div>
          </div>
        </div>
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
          <h1>{data.title}</h1>
          <p>{data.release_artist}</p>
          <p>{data.release_date}</p>
          <p>{data.release_label}</p>
          <div>{data.release_description}</div>
          {data.release_tracks.map((track, index) => (
            <Track key={index} track={track} index={index} />
          ))}
          <div>{data.release_credits}</div>
        </div>
      )
    }
  
    return null;
  };
  
  export default Release;