import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';

const Track = ({ track, index, containerColor, waveformColor, releasetextColor, tracktextColor, progressColor, playing, onPlay, onPrev, onNext }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

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
    if (playing) {
      wavesurferRef.current.pause();
      onPlay(null);  // Set the playing track index to null when pausing
    } else {
      wavesurferRef.current.play();
      onPlay();  // Set the playing track index to this track's index when playing
    }
  };  

  useEffect(() => {
    if (wavesurferRef.current) {
      if (!playing) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
    }
  }, [playing]);

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: waveformColor + '99',
      progressColor: progressColor,
      cursorColor: 'rgba(0,0,0,0)',
      height: 50,
    });

    wavesurferRef.current.on('audioprocess', function() {
      var currentTime = wavesurferRef.current.getCurrentTime();
      var duration = wavesurferRef.current.getDuration();
      updateTimer(currentTime, duration);
    });

    wavesurferRef.current.on('finish', function() {
      onNext();
    });

    return () => {
      wavesurferRef.current && wavesurferRef.current.destroy();
    };
  }, [index, onNext]);

  useEffect(() => {
    wavesurferRef.current.load(`https://thz.fm${track.attach_mp3}`)
      .catch(error => console.error(`Error loading audio file: ${error}`));
  }, [track]);

  return (
    <div className="tracklist" key={index} style={{ backgroundColor: containerColor + '80', color: releasetextColor }}>
      <div className="track-items" key={index} style={{ color: tracktextColor }}>
      <p>{track.track_title}</p>
      </div>
      <button onClick={onPrev}><FaBackward /></button>
      <button onClick={togglePlayPause}>{playing ? <FaPause /> : <FaPlay />}</button>
      <button onClick={onNext}><FaForward /></button>
      <span id={`timer-${index}`}></span>
      <div className="waveform" id={`waveform-${index}`} ref={waveformRef}></div>
      {
  track.track_type === 'Remix'
    ? (
      <>
        <p>Remix by {track.remixer}</p>
        <p>Original by {track.track_artist}</p>
      </>
    )
    : <p>{track.track_type} by {track.track_artist}</p>
      }
    </div>
  );
}


const Release = () => {
  const { title } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title);
  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const onNext = () => {
    const nextTrackIndex = playingTrackIndex < data.release_tracks.length - 1 ? playingTrackIndex + 1 : 0;
    setPlayingTrackIndex(nextTrackIndex);
  };
  
  const onPrev = () => {
    const prevTrackIndex = playingTrackIndex > 0 ? playingTrackIndex - 1 : data.release_tracks.length - 1;
    setPlayingTrackIndex(prevTrackIndex);
  };

  if (data) {
    return (
      <div>
        {/* Display the data */}
        <div className="album-page" style={{backgroundImage: `url(${data.release_artwork})`}}>
          <div className="">
            <span><div className="h1" style={{ color: data.release_text_color }}>{data.title}</div> by: <p style={{ color: data.release_text_color }}>{data.release_artist}</p></span>
           <div>{Array.isArray(data.release_genres) && data.release_genres.map((genre, index) => (
                <p className="genre-item" key={index}>{genre.genre}</p>
              ))}</div>
            <p style={{ color: data.release_text_color }}>{data.release_description}</p>
          <div style={{ color: data.release_text_color }}>
            <button>BUY $ {data.price_usd} USD</button>
          <button>BUY ∑ {data.price_erg} ERG</button>
          </div>
              {Array.isArray(data.release_tracks) && data.release_tracks.map((track, index) => (
                <Track 
                track={track} 
                index={index} 
                key={index} 
                containerColor={data.container_color} 
                waveformColor={data.waveform_color}  
                releasetextColor={data.release_text_color}
                tracktextColor={data.track_text_color}
                progressColor={data.progress_color}
                playing={index === playingTrackIndex}
                onPlay={() => setPlayingTrackIndex(index)}
                onNext={onNext}
                onPrev={onPrev}
                />
              ))}
          </div>
        </div>
      <div className="credits">
      <p>Released On: {data.release_date}</p>
      <p>Publisher: {data.release_label}</p>
        <p>Credits:</p>
              {Array.isArray(data.release_credits) && data.release_credits.map((credit, index) => (
                <p key={index}>{credit.credit_type}: {credit.name__title}</p>
              ))}
      </div>
      </div>
    )
  }

  return null;
};

export default Release;
