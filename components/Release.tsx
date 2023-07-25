import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';

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
    const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#4F4A85',
      progressColor: '#383351',
      url: 'https://thz.fm{(track.attach_mp3}}',
    });    
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
            <audio id="audio-{{ loop.index }}" crossorigin src="https://thz.fm{{track.attach_mp3}}" type="audio/mpeg"></audio>
           
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
