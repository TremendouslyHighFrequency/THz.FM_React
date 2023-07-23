import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { EventItem } from '../types';
import { Link } from "react-router-dom";

const Events = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<EventItem>('Event' , {
      fields: ["title", "event_description","event_photo"],
      limit_start: pageIndex,
      limit: 50,
      orderBy: {
          field: "creation",
          order: 'desc'
      }
  });

  if (isValidating) {
      return <>Loading</>
  }
  if (error) {
      return <>{JSON.stringify(error)}</>
  }
  if (data && Array.isArray(data)) {
         return (
          <div className="albums-index">
                  {
                      data.map(({title, event_photo, Event_description}, i) => (
                          <div key={i} className="album-card" style={{backgroundImage: `url(${event_photo})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                          <div className="album-text">
                                  <h4>{title}</h4>
                                  <Link to={`/event/${title}`}>View Event</Link>
                              </div>
                          </div>
  
                      ))
                  }
                  <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
          </div>
      )
  }
  return null
};

export default Events;
