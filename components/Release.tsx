import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { purchase } from './payment';
import { FooterPlayer } from './FooterPlayer.tsx';

const Track = ({ track, index, setCurrentTime, setDuration, containerColor, waveformColor, releasetextColor, tracktextColor, progressColor, playing, onPlay, onPrev, onNext }) => {
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
      onPlay(null);
    } else {
      wavesurferRef.current.play();
      onPlay(index);
    }
  };

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: waveformColor + '99',
      progressColor: progressColor,
      cursorColor: 'rgba(0,0,0,0)',
      height: 50,
    });

    wavesurferRef.current.load(`https://thz.fm${track.attach_mp3}`)
      .catch(error => console.error(`Error loading audio file: ${error}`));

  // Inside useEffect where wavesurfer is initialized
  wavesurferRef.current.on('audioprocess', function() {
    var currentTime = wavesurferRef.current.getCurrentTime();
    var duration = wavesurferRef.current.getDuration();
    setCurrentTime(currentTime);
    setDuration(duration);
    updateTimer(currentTime, duration);
  });

    return () => {
      wavesurferRef.current && wavesurferRef.current.destroy();
    };
  }, []);  // Empty dependency array so this useEffect only runs once

  // useEffect hook to update 'finish' event listener when onNext prop changes
  useEffect(() => {
    const handleFinish = () => {
      onNext();
    };
    
    wavesurferRef.current.on('finish', handleFinish);

    // Cleanup function to remove event listener when onNext prop changes
    return () => {
      wavesurferRef.current.un('finish', handleFinish);
    };
  }, [onNext]);

  useEffect(() => {
    if (playing) {
      wavesurferRef.current.play();
    } else {
      wavesurferRef.current.pause();
    }
  }, [playing]); // This useEffect runs whenever the playing prop changes

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

// FooterPlayer component


const Release = ({ setTransaction }) => {
  const { name } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', name);

  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);  // Added currentTime state
  const [duration, setDuration] = useState(0);  // Added duration state
  const handleButtonClick = async () => {
    try {
      const price_erg = parseFloat(data.price_erg);
      const artistErgoAddress = data.custom_ergo_address;
      const txId = await purchase(price_erg, artistErgoAddress);
      setTransaction(txId);
    } catch (err) {
      console.error(err);
    }
  };

  const navigate = useNavigate();
const location = useLocation();

// Initialize localState from the URL
const initialLocalState = new URLSearchParams(location.search).get('localState');
const [localState, setLocalState] = useState(initialLocalState || '');

// Call this function whenever you want to update localState and the URL
const updateLocalState = (newValue) => {
  setLocalState(newValue);
  
  // URL-encode newValue and put it in the URL
  const newUrl = `/releases/${name}?localState=${encodeURIComponent(newValue)}`;
  navigate(newUrl);
};

  const onNext = () => {
    const nextTrackIndex = playingTrackIndex < data.release_tracks.length - 1 ? playingTrackIndex + 1 : 0;
    setPlayingTrackIndex(nextTrackIndex);
  };
  
  const onPrev = () => {
    const prevTrackIndex = playingTrackIndex > 0 ? playingTrackIndex - 1 : data.release_tracks.length - 1;
    setPlayingTrackIndex(prevTrackIndex);
  };

  if (data) {
    const currentTrack = playingTrackIndex !== null ? {
      url: `https://thz.fm${data.release_tracks[playingTrackIndex].attach_mp3}`,
      name: data.release_tracks[playingTrackIndex].track_title,
      artist: data.release_tracks[playingTrackIndex].track_artist,
      album: data.title, // Assuming album title is in data.title
      cover_art_url: data.release_artwork // Assuming cover art URL is in data.release_artwork
    } : null;
  
    return (
      <div>
        {/* Display the data */}
        <div className="album-page" style={{backgroundImage: `url(${data.release_artwork})`}}>
          <div className="">
            <span><div className="h1" style={{ color: data.release_text_color }}>{data.title}</div><p style={{ color: data.release_text_color }}>{data.release_type} by: {data.release_artist}</p></span>
           <div>{Array.isArray(data.release_genres) && data.release_genres.map((genre, index) => (
                <p className="genre-item" key={index}>{genre.genre}</p>
              ))}</div>
            <p style={{ color: data.release_text_color }}>{data.release_description}</p>
          <div style={{ color: data.release_text_color }}>
          <button className="erg-button" onClick={handleButtonClick}>BUY ∑ {data.price_erg} ERG</button>
          <button className="usd-button">BUY $ {data.price_usd} USD</button>
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
                setCurrentTime={setCurrentTime}
                setDuration={setDuration}
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
      <FooterPlayer track={currentTrack} setCurrentTime={setCurrentTime} setDuration={setDuration} />
      </div>
    );
  }

  return null;
};

export default Release;
