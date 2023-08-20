import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';
import { FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import { purchase } from './payment';
import FooterPlayer from './FooterPlayer';
import Breadcrumbs from './Breadcrumbs';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './component_styles/Dialog.css';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { getLoggedUser } from './api';

const Track = ({ track, loading, setLoading, handleFavoriteClick, index, setCurrentTime, setDuration, containerColor, waveformColor, releasetextColor, tracktextColor, progressColor, playing, onPlay, onPrev, onNext }) => {
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
    <div className="tracklist border-b-4 border-l-0 border-r-0 border-t-0" key={index} style={{ backgroundColor: containerColor + '80', color: releasetextColor, borderColor: progressColor }}>
             <div className="track-controls mb-2">
             <span className="mr-4" id={`timer-${index}`}></span>
      <button onClick={togglePlayPause}>{playing ? <FaPause /> : <FaPlay />}</button>
 
     
      </div>
      <div onClick={togglePlayPause} className="track-items" key={index} style={{ color: tracktextColor }}>
        <p><span className="text-xs"># {track.track_number}: </span><b>{track.track_title}</b></p>
 
      </div>
      

      <div className="waveform mb-2" id={`waveform-${index}`} ref={waveformRef}></div>
      <div className="flex space-x-4 float-right">
                 
                 
      <button onClick={() => handleFavoriteClick("track", track, index)} disabled={loading[index]}>
  {loading[index] ? (
    <div className="w-4 h-4 border-t-2 border-transparent border-solid rounded-full spin"></div>
  ) : '❤️'}
</button>


                </div>
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
  const onPlay = (index) => {
    setPlayingTrackIndex(index);
};

const ShareModal = ({ data }) => {
  const location = useLocation();
  const currentURL = window.location.origin + location.pathname;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="Button gray">Share</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Share this Release</Dialog.Title>
          
          {/* Display Release Information */}
          <img src={data.release_artwork} alt="Album Artwork" className="share-artwork" />
          <p>{data.title}</p>
          <p>{data.release_artist}</p>
          <p>URL: {currentURL}</p>
          
          {/* Social Sharing Buttons - Placeholder */}
          <p>Share on:</p>
          
<ul class="social-buttons">
  <li class="button__share button__share--facebook"><a href="javascript:void(window.open('https://www.facebook.com/sharer.php?u=' + encodeURIComponent(document.location) + '?t=' + encodeURIComponent(document.title),'_blank'))">Facebook</a></li>
  <li class="button__share button__share--googleplus"><a href="javascript:void(window.open('https://plus.google.com/share?url=' + encodeURIComponent(document.location),'_blank'))">Google+ Share</a></li>
  <li class="button__share button__share--twitter"><a href="javascript:void(window.open('https://twitter.com/share?url=' + encodeURIComponent(document.location) + '&amp;text=' + encodeURIComponent(document.title) + '&amp;via=fabienb&amp;hashtags=koandesign','_blank'))">Twitter</a></li>

  <li class="button__share button__share--linkedin"><a href="javascript:void(window.open('https://www.linkedin.com/shareArticle?url=' + encodeURIComponent(document.location) + '&amp;title=' + encodeURIComponent(document.title),'_blank'))">Linkedin</a></li>

  <li class="button__share button__share--reddit"><a href="javascript:void(window.open('http://reddit.com/submit?url=' + encodeURIComponent(document.location) + '&amp;title=' + encodeURIComponent(document.title),'_blank'))">Reddit</a></li>
  <li class="button__share button__share--hackernews"><a href="javascript:void(window.open('http://news.ycombinator.com/submitlink?u=' + encodeURIComponent(document.location) + '&amp;t=' + encodeURIComponent(document.title),'_blank'))">Hacker News</a></li>
  <li class="button__share button__share--buffer"><a href="javascript:void(window.open('http://bufferapp.com/add?text=' + encodeURIComponent(document.title) + '&amp;url=' + encodeURIComponent(document.location),'_blank'))">Buffer</a></li>
  <li class="button__share button__share--digg"><a href="javascript:void(window.open('https://digg.com/submit?url=' + encodeURIComponent(document.location) + '&amp;title=' + encodeURIComponent(document.title),'_blank'))">Digg</a></li>
  <li class="button__share button__share--tumblr"><a href="javascript:void(window.open('https://www.tumblr.com/share/link?url=' + encodeURIComponent(document.location) + '&amp;name=' + encodeURIComponent(document.title),'_blank'))">Tumblr</a></li>

  <li class="button__share button__share--stumbleupon"><a href="javascript:void(window.open('http://www.stumbleupon.com/submit?url=' + encodeURIComponent(document.location) + '&amp;title=' + encodeURIComponent(document.title),'_blank'))">StumbleUpon</a></li>
  <li class="button__share button__share--delicious"><a href="javascript:void(window.open('https://delicious.com/save?v=5&amp;noui&amp;jump=close&amp;url=' + encodeURIComponent(document.location) + '&amp;title=' + encodeURIComponent(document.title),'_blank'))">Delicious</a></li>
  <li class="button__share button__share--evernote"><a href="javascript:void(window.open('http://www.evernote.com/clip.action?url=' + encodeURIComponent(document.location) + '&amp;title=' + encodeURIComponent(document.title),'_blank'))">Evernote</a></li>
  <li class="button__share button__share--wordpress"><a href="javascript:void(window.open('http://wordpress.com/press-this.php?u=' + encodeURIComponent(document.location) + '&amp;t=' + encodeURIComponent(document.title),'_blank'))">Wordpress</a></li>
  <li class="button__share button__share--pocket"><a href="javascript:void(window.open('https://getpocket.com/save?url=' + encodeURIComponent(document.location) + '&amp;title=' + encodeURIComponent(document.title),'_blank'))">Pocket</a></li>
  <li class="button__share button__share--pinterest"><a href="javascript:void(window.open('https://pinterest.com/pin/create/bookmarklet/?url=' + encodeURIComponent(document.location) + '&amp;description=' + encodeURIComponent(document.title),'_blank'))">Pinterest</a></li>
</ul>

          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const [loading, setLoading] = useState({});

const handleFavoriteClick = async (type, data, index) => {
  if (loading[index]) return; 
  setLoading(prev => ({ ...prev, [index]: true }));
  let requestBody;
  const loggedUser = await getLoggedUser();
  if (type === "track") {
      requestBody = {
          "subject": "Like",
          "for_user": data.owner,
          "type": "Alert",
          "email_content": `${data.track_title}`,
          "read": "0",
          "document_name": data.name,
          "from_user": loggedUser
      };
  } else if (type === "release") {
      requestBody = {
          "subject": "Like",
          "for_user": data.owner,
          "type": "Alert",
          "email_content": `${data.title}`,
          "document_type": "Release",
          "read": "0",
          "document_name": data.name,
          "from_user": loggedUser
      };
  }

  console.log("Sending request with body:", requestBody);  // <-- Add this line to log the request body

  try {
      const response = await fetch('https://thz.fm/api/resource/Notification Log', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
          throw new Error('Failed to send like notification.');
      }
  } catch (error) {
      console.error(error);
  }
  setLoading(prev => ({ ...prev, [index]: false }));
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

  const progressPercentage = (currentTime / duration) * 100;
  
  useEffect(() => {
    setPlayingTrackIndex(null);
  }, [name]);

  
  const currentTrack = playingTrackIndex !== null ? {
    url: `https://thz.fm${data.release_tracks[playingTrackIndex].attach_mp3}`,
    name: data.release_tracks[playingTrackIndex].track_title,
    artist: data.release_tracks[playingTrackIndex].track_artist,
    album: data.title, // Assuming album title is in data.title
    cover_art_url: data.release_artwork // Assuming cover art URL is in data.release_artwork
  } : null;

  if (data) {
    return (
      <div>
        {/* Display the data */}
        
        <div className="album-page">   
          <div className="album-info">
            {/* Text and Details Container */}
            <div className="album-text-info">
              <div className="h1 mb-2">{data.title}</div>
              <p className="mb-4">{data.release_type} by: <Link to={`/artists/${data.release_artist}`}>{data.release_artist}</Link></p>
              <div className="mb-12">
                {Array.isArray(data.release_genres) && data.release_genres.map((genre, index) => (
                  <p className="genre-item" key={index}>{genre.genre}</p>
                ))}
              </div>
              
              <p className="mb-12 text-lg">{data.release_description}</p>
              <FooterPlayer track={currentTrack} playing={playingTrackIndex !== null} onPlay={onPlay} onPrev={onPrev} onNext={onNext} progressPercentage={progressPercentage} />
              <div className="mt-8">
                 
              <Dialog.Root>
    <Dialog.Trigger asChild>
      <button className="Button violet mr-12">Purchase</button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="DialogOverlay" />
      <Dialog.Content className="DialogContent">
        <Dialog.Title className="DialogTitle">Choose payment method</Dialog.Title>
        <Dialog.Description className="DialogDescription">
          This artist accepts both USD and ERG.<br />        
          <span className="text-xs">(ERG payment requires Nautilus wallet connection.)</span>
        </Dialog.Description>
 
          <div className="flex space-x-4">
          <button className="Button green">BUY $ {data.price_usd} USD</button>
          <PayPalButtons />
          <button className="Button orange" onClick={handleButtonClick}>BUY ∑ {data.price_erg} ERG</button>
          </div>

        <Dialog.Close asChild>
          <button className="IconButton" aria-label="Close">
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
  
  <ShareModal data={data} />
          <button onClick={() => handleFavoriteClick("release", data)} className="Button gray ml-12">Add to Favorites</button>
          
              
                
              </div>
            
            </div>

            {/* Album Artwork */}
            <div className="display-artwork" style={{backgroundImage: `url(${data.release_artwork})`}}></div>
          </div>
          
          <div className="tracklist-container">
              {Array.isArray(data.release_tracks) && data.release_tracks.map((track, index) => (
                <Track 
                track={track} 
                index={index} 
                key={`${name}-${index}`}
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
                handleFavoriteClick={handleFavoriteClick}
                loading={loading}
                setLoading={setLoading}
                />
              ))}
              </div>
          </div>
          <div className="flex space-x-8 mt-24">
          
              <div className="credits ml-12 mt-12">
                <p>Released On: {data.release_date}</p>
                <p>Publisher: <Link to={`/labels/${data.release_label}`}>{data.release_label}</Link></p>
                <p>Credits:</p>
                {Array.isArray(data.release_credits) && data.release_credits.map((credit, index) => (
                  <p key={index}>{credit.credit_type}: {credit.name__title}</p>
                ))}
              </div>       
              <div className="ml-24 metadata mt-12">
                <p>ISRC: {data.isrc}</p>
                <p>UPC: {data.upc}</p>
                <p>Release ID: {data.release_id}</p>
                <p>Contract Addr: </p>
              </div>
             </div>
             

      </div>
    );
  }

  return null;
};

export default Release;
