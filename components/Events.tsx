import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Grid, Col, Card, Text } from "@tremor/react";
import MeiliSearch from 'meilisearch';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { EventItem } from '../types';

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
});

const index = client.index('events');

const Events = () => {
  const [events, setEvents] = useState([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [useFallback, setUseFallback] = useState<boolean>(false);

  const { data, error: frappeError } = useFrappeGetDocList<EventItem>('User Event', {
    fields: ["title", "event_description", "event_photo"],
    limit_start: pageIndex,
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  useEffect(() => {
    const fetchEventsFromMeili = async () => {
      try {
        const searchResults = await index.search('', {
          offset: pageIndex,
          limit: 50
        });

        if (searchResults.hits.length > 0) {
          setEvents(searchResults.hits);
        } else {
          setUseFallback(true);
        }
      } catch (err) {
        setUseFallback(true);
      }
    };

    if (!useFallback) {
      fetchEventsFromMeili();
    } else if (data && Array.isArray(data)) {
      setEvents(data);
    }

  }, [pageIndex, useFallback, data]);

  if (events.length > 0) {
    return (
      <>
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
          {
            events.map(({ title, event_photo, event_description }, i) => (
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
        {events.length >= 50 && (
          <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
        )}
      </>
    )
  }

  if (frappeError) {
    return <>{JSON.stringify(frappeError)}</>;
  }

  return <>Loading...</>;
};

export default Events;
