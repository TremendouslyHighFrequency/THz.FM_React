import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { VenueItem } from '../types';
import { Grid, Col, Card, Text } from "@tremor/react";

const Venues = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { data, error, isValidating } = useFrappeGetDocList<VenueItem>('Venue', {
    fields: ["title", "location", "venue_photo"],
    limit_start: pageIndex,
    limit: 10,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  if (isValidating) {
    return <>Loading</>;
  }
  if (error) {
    return <>{JSON.stringify(error)}</>;
  }
  if (data && Array.isArray(data)) {
    return (
      <>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
          {
            data.map(({ title, location, venue_photo }, i) => (
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
        {data.length >= 10 && (
          <button onClick={() => setPageIndex(pageIndex + 10)}>Next page</button>
        )}
      </>
    )
  }
  return null;
};

export default Venues;
