import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
//Ergo / Crypto Imports
import { TransactionBuilder, OutputBuilder } from '@fleet-sdk/core';
import { SHA256 } from 'crypto-js';
import { ErgoDappConnector } from 'ergo-dapp-connector';
import { MintNFT } from './components/MintNFT';


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
  const { title } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title);
  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);  // Added currentTime state
  const [duration, setDuration] = useState(0);  // Added duration state
  const [showModal, setShowModal] = useState(false);
  const [artistAddress, setArtistAddress] = useState(null); // Declare artistAddress state
// State variable for artist data
const [artistData, setArtistData] = useState(null);
const [errorMessage, setErrorMessage] = useState(null); // Declare a new state for the error message


useEffect(() => {
  if (data?.release_artist) {
    fetch(`/api/resource/Artist/${data.release_artist}`)
      .then(response => response.json())
      .then(data => {
        if (!data.artist_ergo) {
          setShowModal(true);
        }
        setArtistData(data);
      })
      .catch(error => console.error(`Error fetching artist data: ${error}`));
  }
}, [data?.release_artist]);

  const onNext = () => {
    const nextTrackIndex = playingTrackIndex < data.release_tracks.length - 1 ? playingTrackIndex + 1 : 0;
    setPlayingTrackIndex(nextTrackIndex);
  };
  
  const onPrev = () => {
    const prevTrackIndex = playingTrackIndex > 0 ? playingTrackIndex - 1 : data.release_tracks.length - 1;
    setPlayingTrackIndex(prevTrackIndex);
  };

  async function purchase() {
    if (!artistAddress) {
      setShowModal(true);
      return;
    }
    // requests wallet access
    if (await ergoConnector.nautilus.connect()) {
      // get the current height from the the dApp Connector
      const height = await ergo.get_current_height();
  
      const unsignedTx = new TransactionBuilder(height)
        .from(await ergo.get_utxos()) // add inputs from dApp Connector
        .to(
          // Add output
          new OutputBuilder(
            amount.toString(),  // Convert BigInt to string
            artistAddress  // Use the artist's Ergo address
          )
        )
        .sendChangeTo(await ergo.get_change_address()) // Set the change address to the user's default change address
        .payMinFee() // set minimal transaction fee
        .build() // build the transaction
        .toEIP12Object(); // converts the ErgoUnsignedTransaction instance to an dApp Connector compatible plain object
  
      // requests the signature
      const signedTx = await ergo.sign_tx(unsignedTx);
  
      // send the signed transaction to the mempool
      const txId = await ergo.submit_tx(signedTx);
  
      // prints the Transaction ID of the submitted transaction on the console
      console.log(txId);
    }
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
<div className="modal">
<Modal 
  show={!!errorMessage} 
  onHide={() => setErrorMessage(null)}
  dialogClassName="modal-90w"
  aria-labelledby="example-custom-modal-styling-title"
>
  <Modal.Header closeButton>
    <Modal.Title id="example-custom-modal-styling-title">Error</Modal.Title>
  </Modal.Header>
  <Modal.Body>{errorMessage}</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setErrorMessage(null)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
  </div>
      </div>

    );
  }

  return null;
};

export default Release;
