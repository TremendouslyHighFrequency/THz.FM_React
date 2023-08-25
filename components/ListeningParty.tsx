import React, { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // Assuming this hook exists based on your `Release` component
import FooterPlayer from './FooterPlayer';
import ChatBox from './ChatBox'; // Assuming you have a ChatBox component

const AlbumReleaseListeningParty = () => {
  const { name } = useParams(); // Assuming the route parameter is "id" for the release
  const { data: release, error } = useFrappeGetDoc('Release', name); // Using 'Album' as the document type, adjust as necessary
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);


  useEffect(() => {
    if (!release) return;

    // Start the release at the specified timestamp
    const playStartTime = new Date(release.playTimestamp).getTime();
    const currentTime = Date.now();
    if (currentTime >= playStartTime) {
      setPlaying(true);
    } else {
      setTimeout(() => {
        setPlaying(true);
      }, playStartTime - currentTime);
    }
  }, [release]);

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  if (error) {
    return <div>Error fetching release data!</div>;
  }

  if (!release) {
    return <div>Loading...</div>;
  }

  return (
    <div className="listening-party-container">
      <div className="release-art-and-chat">
        <img src={release.artworkUrl} alt={release.title} className="release-art" />
<ChatBox messages={[]} onSendMessage={handleSendMessage} />
      </div>
      <FooterPlayer
        playing={playing}
        track={release}
        currentTime={currentTime}
        duration={duration}
      />
    </div>
  );
};

export default AlbumReleaseListeningParty;
