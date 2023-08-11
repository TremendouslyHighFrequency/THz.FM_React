import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { VenueItem } from '../types';

const Venues = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<VenueItem>('Venue' , {
      fields: ["title", "location","venue_photo"],
      limit_start: pageIndex,
      limit: 10,
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
                      data.map(({title, location, venue_photo}, i) => (
                          <div key={i} className="album-card" style={{backgroundImage: `url(${venue_photo})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                          <div className="album-text">
                                  <h4>{title}</h4>
                                  <p>{location}</p>
                              </div>
                          </div>
                      ))
                  }
{data.length >= 50 && (
              <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
            )}          </div>
      )
  }
  return null
};

export default Venues;
