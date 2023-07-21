import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [pageIndex, setPageIndex] = useState(0); // initial value

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const userResponse = await axios.get('https://thz.fm/api/method/frappe.auth.get_logged_user', {withCredentials: true});
        const loggedUser = userResponse.data.message;

        const trackResponse = await axios.get(`https://thz.fm/api/resource/Track?fields=["track_title","track_number","parent","track_artist","remixer","track_type","attach_wav","attach_mp3","price_usd","price_erg","label","artwork","route","published"]&filters=[["Track","owner","=","${loggedUser}"]]&parent=Release&limit_page_length=10&limit_start=${pageIndex}`);
        setTracks(trackResponse.data.data);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    fetchTracks();
  }, [pageIndex]); // dependencies

  return (
    <div className="albums-index">
      {tracks.map((track, i) => (
        <div 
          key={i} 
          className="album-card" 
          style={{backgroundImage: `url(${track.artwork})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
        >
          <div className="album-text">
            <h4>{track.track_title}</h4>
            <p>{track.track_artist}</p>
          </div>
          <Link to={`/releases/${track.track_artist}/${track.parent}/${track.track_title}`}>View Track</Link>
        </div>
      ))}
      <button onClick={() => setPageIndex(pageIndex + 10)}>Next page</button>
    </div>
  );
};

export default Tracks;