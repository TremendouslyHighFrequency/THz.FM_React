import React, { useState, useEffect } from 'react';
import { Grid, Col, Card, Text } from "@tremor/react";
import MeiliSearch from 'meilisearch';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { VenueItem } from '../types';

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
});

const index = client.index('venues');

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const { data, error: frappeError } = useFrappeGetDocList<VenueItem>('Venue', {
    fields: ["title", "location", "venue_photo"],
    limit_start: pageIndex,
    limit: 10,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  useEffect(() => {
    const fetchVenuesFromMeili = async () => {
      try {
        const searchResults = await index.search('', {
          offset: pageIndex,
          limit: 10
        });

        if (searchResults.hits.length > 0) {
          setVenues(searchResults.hits);
        } else {
          setUseFallback(true);
        }
      } catch (err) {
        setUseFallback(true);
      }
    };

    if (!useFallback) {
      fetchVenuesFromMeili();
    } else if (data && Array.isArray(data)) {
      setVenues(data);
    }

  }, [pageIndex, useFallback, data]);

  if (venues.length > 0) {
    return (
      <>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
          {
            venues.map(({ title, location, venue_photo }, i) => (
              <Col key={i}>
                <Card>
                  <div className="artist-card-bg" style={{ position: 'relative', padding: '16px', backgroundImage: `url(${venue_photo})` }}>
                    <Text>{title}</Text>
                    <p>{location}</p>
                  </div>
                </Card>
              </Col>
            ))
          }
        </Grid>
        {venues.length >= 10 && (
          <button onClick={() => setPageIndex(pageIndex + 10)}>Next page</button>
        )}
      </>
    )
  }

  if (frappeError) {
    return <>{JSON.stringify(frappeError)}</>;
  }

  return <>Loading...</>;
};

export default Venues;
