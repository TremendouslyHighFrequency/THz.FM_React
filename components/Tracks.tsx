import React, { useState, useEffect } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { LabelItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text, MultiSelect, MultiSelectItem, List, ListItem, SearchSelect } from "@tremor/react";
import MeiliSearch from 'meilisearch';
import LabelFeature from './LabelFeature';
import axios from 'axios';

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
});

const index = client.index('tracks');

const Tracks = () => {
  const [tracks, setTracks] = useState([]);
  const [parents, setParents] = useState({}); // Store both parent titles and artworks
  const [pageIndex, setPageIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const fetchTracksFromMeili = async () => {
      try {
        const searchResults = await index.search('', {
          offset: pageIndex,
          limit: 50
        });

        if (searchResults.hits.length > 0) {
          setTracks(searchResults.hits);
        } else {
          setUseFallback(true);
        }
      } catch (err) {
        setUseFallback(true);
      }
    };

    const fetchTracksFromFrappe = async () => {
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

    if (!useFallback) {
      fetchTracksFromMeili();
    } else {
      fetchTracksFromFrappe();
    }

  }, [pageIndex, useFallback]);

  return (
    <div className="labelPage grid grid-cols-[minmax(0,1fr),2fr] gap-4">
    <div className="searchColumn p-2 pr-8">
    <h1 className="text-3xl font-bold uppercase">Published Tracks</h1>
  <Text className="text-lg mb-8">Finished whole songs to enjoy!</Text>
      <MultiSelect className="w-96" placeholder='Search for an artist name or genre'>
        <MultiSelectItem value="1">1</MultiSelectItem>
        <MultiSelectItem value="2">2</MultiSelectItem>
        <MultiSelectItem value="3">3</MultiSelectItem>
      </MultiSelect>

      <div className="py-6">
     
      </div>
<Card>
      <List>
        {tracks.map((track, i) => (
          <ListItem key={i} className="bg-white p-2" style={{ position: 'relative' }}>
           <div className="playButton float-left w-8 block"><img className="w-8" src="https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/play-icon.png" style={{ position: 'relative', backgroundImage: `url(${parents[track.parent]?.artwork})` }} />Play</div>
          
              <div className="inline-block px-4">
              <Text className="font-bold text-gray-800">{track.track_title}</Text> <Text className="text-xs text-gray-400">{track.track_artist}</Text>
                <Text className="text-xs py-2 text-gray-700">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</Text>
                <Link to={`/releases/${parents[track.parent]?.title}/${track.track_title}/by/${track.track_artist}`}>View Release</Link>
              </div>
              
            
          </ListItem>
        ))}
      </List>

</Card>
      {tracks.length >= 50 && (
        <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
      )}
    </div>

    <div className="labelDisplayColumn flex-grow mr-6">
      <LabelFeature />
  </div>

</div>
  );
};

export default Tracks;
