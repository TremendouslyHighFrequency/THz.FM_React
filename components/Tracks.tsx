import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Tracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const userResponse = await axios.get('https://thz.fm/api/method/frappe.auth.get_logged_user', {withCredentials: true});
        const loggedUser = userResponse.data.message;

        const trackResponse = await axios.get(`https://thz.fm/api/resource/Track?fields=["track_title","track_number","parent","track_artist","remixer","track_type","attach_wav","attach_mp3","price_usd","price_erg","label","artwork","route","published"]&filters=[["Track","owner","=","${loggedUser}"]]&parent=Release`);
        setTracks(trackResponse.data.data);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div>
      {tracks.map((track, index) => (
        <div key={index}>
          <Link to={`/releases/${track.parent}/tracks/${track.track_number}`}>{track.track_title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Tracks;
