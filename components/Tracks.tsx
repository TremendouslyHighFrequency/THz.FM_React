import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [parents, setParents] = useState({}); // new state variable to store parent releases
  const [pageIndex, setPageIndex] = useState(0); // initial value

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const trackResponse = await axios.get(`https://thz.fm/api/resource/Track?fields=["track_title","track_number","parent","track_artist","remixer","track_type","attach_wav","attach_mp3","price_usd","price_erg","label","artwork","route","published"]&parent=Release&limit_page_length=10&limit_start=${pageIndex}`);
        const trackData = trackResponse.data.data;

        const parentNames = trackData.map(track => track.parent);
        const uniqueParentNames = [...new Set(parentNames)];
        const parentPromises = uniqueParentNames.map(name => axios.get(`https://thz.fm/api/resource/Release/${name}`));
        const parentResponses = await Promise.all(parentPromises);
        const parentData = parentResponses.reduce((obj, response, i) => {
          obj[uniqueParentNames[i]] = response.data.data.title;
          return obj;
        }, {});

        setTracks(trackData);
        setParents(parentData);
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
            <Link to={`/releases/${parents[track.parent] || 'default-parent'}/${track.track_title || 'default-title'}/by/${track.track_artist || 'default-artist'}`}>View Track</Link>
          </div>
        </div>
      ))}
      <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
    </div>
  );
};

export default Tracks;
