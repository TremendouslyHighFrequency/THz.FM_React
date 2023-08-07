import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [parents, setParents] = useState({}); // Store both parent titles and artworks
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const trackResponse = await axios.get(`https://thz.fm/api/resource/Track?fields=["track_title","track_number","parent","track_artist","remixer","track_type","attach_wav","attach_mp3","price_usd","price_erg","label","artwork","route","published"]&parent=Release&limit_page_length=50&limit_start=${pageIndex}`);
        const trackData = trackResponse.data.data;

        const parentNames = trackData.map(track => track.parent);
        const uniqueParentNames = [...new Set(parentNames)];
        const parentPromises = uniqueParentNames.map(name => axios.get(`https://thz.fm/api/resource/Release/${name}`));
        const parentResponses = await Promise.all(parentPromises);

        const parentData = parentResponses.reduce((obj, response, i) => {
          obj[uniqueParentNames[i]] = {
            title: response.data.data.title,
            artwork: response.data.data.release_artwork // Fetch the artwork from the parent
          };
          return obj;
        }, {});

        setTracks(trackData);
        setParents(parentData);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    fetchTracks();
  }, [pageIndex]);

  return (
    <div className="albums-index">
      {tracks.map((track, i) => (
        <Link to={`/releases/${parents[track.parent].title}/${track.track_title}/by/${track.track_artist}`}>
        <div 
          key={i} 
          className="album-card" 
          style={{backgroundImage: `url(${parents[track.parent].artwork})`, backgroundSize: 'cover', backgroundPosition: 'center'}} // Use artwork from the parent
        >
          <div className="album-text">
            <h4>{track.track_title}</h4>
            <p>{track.track_artist}</p>
           
          </div>
        </div>
        </Link>
      ))}
      <button onClick={() => setPageIndex(pageIndex + 10)}>Next page</button>
    </div>
  );
};

export default Tracks;
