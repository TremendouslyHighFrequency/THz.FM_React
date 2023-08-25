import React, { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // Assuming this hook exists based on your `Release` component
import FooterPlayer from './FooterPlayer';
import ChatBox from './ChatBox'; // Assuming you have a ChatBox component

const AlbumReleaseListeningParty = () => {
  const { id } = useParams(); // Assuming the route parameter is "id" for the album
  const { data: album, error } = useFrappeGetDoc('Album', id); // Using 'Album' as the document type, adjust as necessary
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { connect, sendMessage, messages } = usePartyKit(); // Simplified usage based on README

  useEffect(() => {
    if (!album) return;

    // Connect to PartyKit room for the listening party
    connect(`listening-party-${album.id}`);

    // Start the album at the specified timestamp
    const playStartTime = new Date(album.playTimestamp).getTime();
    const currentTime = Date.now();
    if (currentTime >= playStartTime) {
      setPlaying(true);
    } else {
      setTimeout(() => {
        setPlaying(true);
      }, playStartTime - currentTime);
    }
  }, [album]);

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  if (error) {
    return <div>Error fetching album data!</div>;
  }

  if (!album) {
    return <div>Loading...</div>;
  }

  return (
    <div className="listening-party-container">
      <div className="album-art-and-chat">
        <img src={album.artworkUrl} alt={album.title} className="album-art" />
        <ChatBox messages={messages} onSendMessage={handleSendMessage} />
      </div>
      <FooterPlayer
        playing={playing}
        track={album}
        currentTime={currentTime}
        duration={duration}
      />
    </div>
  );
};

export default AlbumReleaseListeningParty;
