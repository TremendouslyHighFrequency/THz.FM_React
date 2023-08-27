import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { EventItem } from '../types';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text } from "@tremor/react";

const Events = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { data, error, isValidating } = useFrappeGetDocList<EventItem>('User Event', {
    fields: ["title", "event_description", "event_photo"],
    limit_start: pageIndex,
    limit: 50,
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
            data.map(({ title, event_photo, event_description }, i) => (
              <Col key={i}>
                <Card>
                  <div className="artist-card-bg" style={{ position: 'relative', padding: '16px', backgroundImage: `url(${event_photo})` }}>
                    <Text>{title}</Text>
                    <Link to={`/event/${title}`}>View Event</Link>
                  </div>
                </Card>
              </Col>
            ))
          }
        </Grid>
        {data.length >= 50 && (
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        )}
      </>
    )
  }
  return null;
};

export default Events;
