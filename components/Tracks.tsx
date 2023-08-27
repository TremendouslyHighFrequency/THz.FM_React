import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text } from "@tremor/react";
import MeiliSearch from 'meilisearch';

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
    <>
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
        {tracks.map((track, i) => (
          <Col key={i}>
            <Link to={`/releases/${parents[track.parent]?.title}/${track.track_title}/by/${track.track_artist}`}>
              <Card>
                <div className="artist-card-bg" style={{ position: 'relative', padding: '16px', backgroundImage: `url(${parents[track.parent]?.artwork})` }}>
                  <Text>{track.track_title}</Text>
                  <p>{track.track_artist}</p>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Grid>
      <div className="flex justify-center mt-10 space-x-1">
            <button onClick={() => setPageIndex(prevIndex => prevIndex - 50)} className="flex items-center justify-center h-8 px-2 rounded text-sm font-medium text-gray-400">Prev</button>
            <button onClick={() => setPageIndex(prevIndex => prevIndex + 50)} className="flex items-center justify-center h-8 px-2 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600">Next</button>
          </div>
    </>
  );
};

export default Tracks;
