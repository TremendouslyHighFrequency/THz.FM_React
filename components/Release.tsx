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
import { getLoggedUser } from './api';
import { PayPalButtons } from "@paypal/react-paypal-js";
import ReleaseFeature from './ReleaseFeature';

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
        : <p>{track.track_type} by <Link to={`/artists/${track.track_artist}`}>{track.track_artist}</Link></p>
      }
  
    </div>
    
  );
  
}

const Release = ({ setTransaction }) => {
  const { name } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', name);
  const [orderID, setOrderID] = useState(null); // Add this line to define orderID state
  const [playingTrackIndex, setPlayingTrackIndex] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);  // Added currentTime state
  const [duration, setDuration] = useState(0);  // Added duration state
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);

  const handleButtonClick = async () => {
    setShowLoading(true); // Show loading spinner/modal
    try {
      const price_erg = parseFloat(data.price_erg);
      const artistErgoAddress = data.custom_ergo_address;
      const txId = await purchase(price_erg, artistErgoAddress);
      setTransaction(txId);
    } catch (err) {
      console.error(err);
    }
    setShowLoading(false); // Hide loading spinner/modal
  };
  const onPlay = (index) => {
    setPlayingTrackIndex(index);
};

const [message, setMessage] = useState('');

const ShareModal = ({ data }) => {
  const location = useLocation();
  const currentURL = window.location.origin + location.pathname;
  const share = (platform) => {
    const currentURL = window.location.origin + location.pathname;
    const title = data.title; // Adjust this if it's not the correct title you want to share
  
    let shareURL = "";
  
    switch (platform) {
    case "facebook":
        shareURL = `https://www.facebook.com/sharer.php?u=${encodeURIComponent(currentURL)}&t=${encodeURIComponent(title)}`;
        break;
    case "googleplus":
        shareURL = `https://plus.google.com/share?url=${encodeURIComponent(currentURL)}`;
        break;
    case "twitter":
        shareURL = `https://twitter.com/share?url=${encodeURIComponent(currentURL)}&text=${encodeURIComponent(title)}`;
        break;
    case "linkedin":
        shareURL = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}`;
        break;
    case "reddit":
        shareURL = `http://reddit.com/submit?url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}`;
        break;
    case "hackernews":
        shareURL = `http://news.ycombinator.com/submitlink?u=${encodeURIComponent(currentURL)}&t=${encodeURIComponent(title)}`;
        break;
    case "buffer":
        shareURL = `http://bufferapp.com/add?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentURL)}`;
        break;
    case "digg":
        shareURL = `https://digg.com/submit?url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}`;
        break;
    case "tumblr":
        shareURL = `https://www.tumblr.com/share/link?url=${encodeURIComponent(currentURL)}&name=${encodeURIComponent(title)}`;
        break;
    case "stumbleupon":
        shareURL = `http://www.stumbleupon.com/submit?url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}`;
        break;
    case "delicious":
        shareURL = `https://delicious.com/save?v=5&noui&jump=close&url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}`;
        break;
    case "evernote":
        shareURL = `http://www.evernote.com/clip.action?url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}`;
        break;
    case "wordpress":
        shareURL = `http://wordpress.com/press-this.php?u=${encodeURIComponent(currentURL)}&t=${encodeURIComponent(title)}`;
        break;
    case "pocket":
        shareURL = `https://getpocket.com/save?url=${encodeURIComponent(currentURL)}&title=${encodeURIComponent(title)}`;
        break;
    case "pinterest":
        shareURL = `https://pinterest.com/pin/create/bookmarklet/?url=${encodeURIComponent(currentURL)}&description=${encodeURIComponent(title)}`;
        break;
    default:
        return;
}
  
    window.open(shareURL, '_blank');
    const popup = window.open(shareURL, '_blank');
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        alert("Pop-up blocked! Please allow pop-ups from this site to share.");
    }
  };

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
          <p className="mt-2">{data.title}</p>
          <p className="mb-4">{data.release_artist}</p>
          
          {/* Social Sharing Buttons - Placeholder */}
          <p>Share on:</p>
          <ul className="social-buttons">
  <li className="button__share button__share--facebook">
    <a href="#" onClick={(e) => { e.preventDefault(); share("facebook"); }}>Facebook</a>
  </li>
  <li className="button__share button__share--googleplus">
    <a href="#" onClick={(e) => { e.preventDefault(); share("googleplus"); }}>Google+</a>
  </li>
  <li className="button__share button__share--twitter">
    <a href="#" onClick={(e) => { e.preventDefault(); share("twitter"); }}>Twitter</a>
  </li>
  <li className="button__share button__share--linkedin">
    <a href="#" onClick={(e) => { e.preventDefault(); share("linkedin"); }}>LinkedIn</a>
  </li>
  <li className="button__share button__share--reddit">
    <a href="#" onClick={(e) => { e.preventDefault(); share("reddit"); }}>Reddit</a>
  </li>
  <li className="button__share button__share--hackernews">
    <a href="#" onClick={(e) => { e.preventDefault(); share("hackernews"); }}>Hacker News</a>
  </li>
  <li className="button__share button__share--buffer">
    <a href="#" onClick={(e) => { e.preventDefault(); share("buffer"); }}>Buffer</a>
  </li>
  <li className="button__share button__share--digg">
    <a href="#" onClick={(e) => { e.preventDefault(); share("digg"); }}>Digg</a>
  </li>
  <li className="button__share button__share--tumblr">
    <a href="#" onClick={(e) => { e.preventDefault(); share("tumblr"); }}>Tumblr</a>
  </li>
  <li className="button__share button__share--stumbleupon">
    <a href="#" onClick={(e) => { e.preventDefault(); share("stumbleupon"); }}>StumbleUpon</a>
  </li>
  <li className="button__share button__share--delicious">
    <a href="#" onClick={(e) => { e.preventDefault(); share("delicious"); }}>Delicious</a>
  </li>
  <li className="button__share button__share--evernote">
    <a href="#" onClick={(e) => { e.preventDefault(); share("evernote"); }}>Evernote</a>
  </li>
  <li className="button__share button__share--wordpress">
    <a href="#" onClick={(e) => { e.preventDefault(); share("wordpress"); }}>Wordpress</a>
  </li>
  <li className="button__share button__share--pocket">
    <a href="#" onClick={(e) => { e.preventDefault(); share("pocket"); }}>Pocket</a>
  </li>
  <li className="button__share button__share--pinterest">
    <a href="#" onClick={(e) => { e.preventDefault(); share("pinterest"); }}>Pinterest</a>
  </li>
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
const [showLoading, setShowLoading] = useState(false);

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

  const payload = (orderData) => {
    return {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: orderData.amount_usd,
          },
        },
      ],
    };
  };


  
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
        
        <div className="album-page grid grid-cols-[minmax(0,1fr),2fr] gap-4">   
        
        <div className="tracklistContainer p-2 pr-8">
        <div className="h1 mb-2">{data.title}</div>



<p className="mb-4"><Link to={`/search/type/${data.release_type}`}>{data.release_type}</Link> by: <Link to={`/artists/${data.release_artist}`}>{data.release_artist}</Link></p>

{Array.isArray(data.release_genres) && data.release_genres.map((genre, index) => (
        <Link to={`/search/genre/${genre.genre}`}><p className="genre-item" key={index}>{genre.genre}</p></Link>
      ))}

<div className="my-6">
       
       <Dialog.Root>
   <Dialog.Trigger asChild>
   <button className="Button violet mr-12">Purchase</button>
   </Dialog.Trigger>
   <Dialog.Portal>
   <Dialog.Overlay className="DialogOverlay" />
   <Dialog.Content className="DialogContent">
   <Dialog.Title className="DialogTitle">Choose payment method</Dialog.Title>
   <Dialog.Description className="DialogDescription">
   This artist accepts both ERG and USD.<br />        
   <span className="text-xs">(ERG payment requires Nautilus wallet connection.)</span>
   </Dialog.Description>
   
   <div className="flex space-x-4">
   {
   !showPayPalButtons && (
   <>
   <button className="Button orange w-full text-lg" onClick={handleButtonClick} style={{ fontFamily: "'Russo One', sans-serif" }}><span><b>∑ </b>{data.price_erg} ERG</span></button>
   <button className="Button green w-full text-lg" onClick={() => setShowPayPalButtons(true)} style={{ fontFamily: "'Russo One', sans-serif" }}><span>${data.price_usd} USD</span></button>
   </>
   )
   }
   
   {showPayPalButtons && data.price_usd && (
   <>
   <PayPalButtons
   price_usd={data.price_usd}
   createOrder={async (orderData, actions) => {
   const amount_usd = data.price_usd; // Access price_usd from component's props
   try {
   const response = await fetch(`https://thz.fm/api/method/frappe.create_order.create_paypal_order?amount_usd=${amount_usd}`);
   const responseData = await response.json();
   console.log("API Response:", responseData);
   
   if (responseData.message && responseData.message.orderID) {
   return responseData.message.orderID; // Return the nested order ID
   } else {
   const errorMsg = responseData.error ? responseData.error : 'Failed to create PayPal order';
   throw new Error(errorMsg);
   }
   } catch (error) {
   console.error("Error creating PayPal order:", error);
   throw error; // Rethrow the error to propagate it
   }
   }}
   onApprove={async (data, actions) => {
   console.log("onApprove Data:", data);
   try {
   const orderID = data.orderID;
   console.log("Received orderID:", orderID);
   
   // Make a POST call to capture the PayPal order
   const response = await fetch(`https://thz.fm/api/method/frappe.create_order.capture_paypal_order`, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({ order_id: orderID })
   });
   const captureResponse = await response.json();
   
   if (captureResponse && !captureResponse.error) {
   setMessage(`Payment captured successfully!`);
   } else {
   throw new Error(captureResponse.error || 'Failed to capture payment.');
   }
   
   } catch (error) {
   console.error("Error capturing PayPal order:", error);
   setMessage('Failed to capture payment.');
   }
   }}
   />
   <button 
         className="Button gray w-full text-lg" 
         onClick={() => setShowPayPalButtons(false)} 
         style={{ fontFamily: "'Russo One', sans-serif", marginLeft: '10px' }}>
             <span>Back</span>
     </button>
      </>
   )}
   
   
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

              <div className="detailContainer rounded-lg shadow-xl p-2 pt-4 bg-white">

<div className="album-info mt-6">
  {/* Text and Details Container */}
  <div className="album-text-info">
    <div className="mb-12">
            {/* Album Artwork */}
  <div className="display-artwork" style={{backgroundImage: `url(${data.release_artwork})`}}></div>

    </div>


    <p className="mb-12 text-lg">{data.release_description}</p>
    <Link to={`/releases/${data.title}/by/${data.release_artist}/${data.name}/listening-party`}>Join Listening Party</Link>
     
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
</div>
<FooterPlayer track={currentTrack} playing={playingTrackIndex !== null} onPlay={onPlay} onPrev={onPrev} onNext={onNext} progressPercentage={progressPercentage} />

     { showLoading && (
 <div className="loading-modal">

 <img className="nautilus-logo w-32 mb-4" src="https://thz.fm/files/m-512.png" alt="Nautilus Logo"/>
 
 <span className="p-24 bg-white rounded-lg shadow-lg text-black">Waiting for Nautilus wallet...</span>
</div>
)}        

     
      </div>




    );
  }

  return null;
};

export default Release;
