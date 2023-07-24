import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';

var currentAudio;
var wavesurfers = [];

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = Math.floor(seconds % 60);
  return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}

function updateTimer(currentTime, duration) {
  var currentTimeFormatted = formatTime(currentTime);
  var durationFormatted = formatTime(duration);
  var timerElement = document.getElementById('timer');
  timerElement.textContent = currentTimeFormatted + ' / ' + durationFormatted;
}

function playAudio(index) {
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
}

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

// Initialize wavesurfers
var waveContainers = document.querySelectorAll('[id^="waveform-"]');
waveContainers.forEach(function(container, index) {
  var wavesurfer = WaveSurfer.create({
    container: container,
    // backend: 'MediaElement', // Use HTML5 audio element as the backend
    waveColor: 'lightskyblue',
    progressColor: 'lightslategray',
    cursorColor: 'rgba(0,0,0,0)',
    height: 88
  });
  wavesurfers[index] = wavesurfer;
  wavesurfer.load(document.querySelector('#audio-' + (index + 1)).src);
  wavesurfer.on('ready', function() {
    if (index === 0) {
      wavesurfer.pause();
    }
  });
});

const Release = () => {
  const { title, artist } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title); // assuming 'title' can be used to fetch a single ReleaseItem

  useEffect(() => {
    // do something when title or artist changes, such as fetch related data
  }, ["title", "release_id", "release_artwork", "release_artist", "release_label", "release_description", "release_tracks[]", "release_credits", "release_date"]);

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
        <div>{data.release_description}</div>
       <div>
        {data.release_tracks.map((track, index) => (
          <div key={index}>
            <p>{track.title}</p>
            <p>{track.artist}</p>
            <p></p>
            <div class="audio-controls-container">
                <div id="timer-{{ loop.index }}"></div>
            <div class="audio-controls">
            <audio id="audio-{{ loop.index }}" crossorigin src="{{https://thz.fm{track.attach_mp3}}" type="audio/mpeg"></audio>
            <div class="waveform" id="waveform-{{ loop.index }}"></div>
            <div class="buttons">
                <button class="previous" onclick="previousAudio({{ loop.index }})"> Previous </button>
                <button id="playButton" onclick="playAudio({{ loop.index }})"> Play </button>
                <button onclick="pauseAudio({{ loop.index }})"> Pause </button>
                <button onclick="resumeAudio({{ loop.index }})"> Resume </button>
                <button onclick="nextAudio({{ loop.index }})"> Next </button>
            </div>
            </div>
           </div>
          </div>
        ))}
        </div>
        <div>{data.release_credits}</div>
        </div>
        </div>
      </div>
    )
  }

  return null;
};

export default Release;
