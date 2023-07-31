import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import FooterPlayer from './FooterPlayer.js';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { purchase } from './payment';

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

const Release = () => {
  const { name } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', name);

  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);  // Added currentTime state
  const [duration, setDuration] = useState(0);  // Added duration state


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
            <span><div className="h1" style={{ color: data.release_text_color }}>{data.title}</div><p style={{ color: data.release_text_color }}>{data.release_type} by: {data.release_artist}</p></span>
           <div>{Array.isArray(data.release_genres) && data.release_genres.map((genre, index) => (
                <p className="genre-item" key={index}>{genre.genre}</p>
              ))}</div>
            <p style={{ color: data.release_text_color }}>{data.release_description}</p>
          <div style={{ color: data.release_text_color }}>
          <button className="erg-button" onClick={async () => {
                const txId = await purchase(parseFloat(data.price_erg));
                setTxId(txId);
              }}>BUY ∑ {data.price_erg} ERG</button>
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
      {playingTrackIndex !== null && (
          <FooterPlayer 
            track={data.release_tracks[playingTrackIndex]}
            albumArtwork={data.release_artwork}
            currentTime={currentTime}
            duration={duration}
          />
        )}
      </div>
    );
  }

  return null;
};

export default Release;
