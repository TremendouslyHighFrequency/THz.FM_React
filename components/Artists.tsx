import React, { useState, useEffect } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ArtistItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text, MultiSelect, MultiSelectItem } from "@tremor/react";
import MeiliSearch from 'meilisearch';

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
});

const index = client.index('artists');

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const { data, error: frappeError } = useFrappeGetDocList<ArtistItem>('Artist', {
    fields: ["title", "artist_bio", "artist_photo"],
    limit_start: pageIndex,
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const searchResults = await index.search('', {
          offset: pageIndex,
          limit: 50
        });
        if (searchResults.hits.length > 0) {
          setArtists(searchResults.hits);
          setLoading(false);
        } else {
          setUseFallback(true);
        }
      } catch (err) {
        setUseFallback(true);
      }
    };

    if (!useFallback) {
      fetchArtists();
    } else if (data && Array.isArray(data)) {
      setArtists(data);
      setLoading(false);
    } else if (frappeError) {
      setError(frappeError);
      setLoading(false);
    }
  }, [pageIndex, useFallback, data, frappeError]);

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{JSON.stringify(error)}</>;
  }
  
  if (artists.length > 0) {
    return (
      <>
        <MultiSelect className="w-96">
          <MultiSelectItem value="1">1</MultiSelectItem>
          <MultiSelectItem value="2">2</MultiSelectItem>
          <MultiSelectItem value="3">3</MultiSelectItem>
        </MultiSelect>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
          {artists.map(artist => (
            <Col key={artist.id} numColSpan={1} numColSpanLg={1}>
              <Card>
                <div className="artist-card-bg" style={{ position: 'relative', padding: '16px' }}>
                  <Text>{artist.title}</Text>
                  <Link to={`/artists/${artist.title}`}>View Artist</Link>
                </div>
              </Card>
            </Col>
          ))}
        </Grid>
        {artists.length >= 50 && (
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        )}
      </>
    );
  }

  return null;
};

export default Artists;
