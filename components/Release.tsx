import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';

const Release = () => {
  const { title } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title);

  const [wavesurfers, setWavesurfers] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    if (data) {
      const newWavesurfers = data.release_tracks.map((track, index) => {
        const wavesurfer = WaveSurfer.create({
          container: '#waveform-' + (index + 1),
          waveColor: 'lightskyblue',
          progressColor: 'lightslategray',
          cursorColor: 'rgba(0,0,0,0)',
          height: 88
        });
        wavesurfer.load(track.attach_mp3);
        return wavesurfer;
      });
      setWavesurfers(newWavesurfers);
    }
  }, [data]);

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
        {/* Display the data */}
        {data.release_tracks.map((track, index) => (
          <div key={index}>
            <p>{track.title}</p>
            <p>{track.artist}</p>
            <div className="audio-controls-container">
              <div id={`timer-${index}`}></div>
              <div className="audio-controls">
                <audio id={`audio-${index}`} crossorigin src={track.attach_mp3} type="audio/mpeg"></audio>
                <div className="waveform" id={`waveform-${index}`}></div>
                <div className="buttons">
                  <button className="previous" onClick={() => previousAudio()}>Previous</button>
                  <button id="playButton" onClick={() => playAudio(index)}>Play</button>
                  <button onClick={() => pauseAudio()}>Pause</button>
                  <button onClick={() => resumeAudio()}>Resume</button>
                  <button onClick={() => nextAudio()}>Next</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null;
};

export default Release;
