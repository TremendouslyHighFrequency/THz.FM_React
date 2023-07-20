import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { TrackItem } from '../types';

const Tracks = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<TrackItem>('Track' , {
      fields: ["title", "track_artist","artwork"],
      limit_start: pageIndex,
      limit: 10,
      parent: "Release",
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
                      data.map(({title, track_artist, artwork}, i) => (
                          <div key={i} className="album-card" style={{backgroundImage: `url(${artwork})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                          <div className="album-text">
                                  <h4>{title}</h4>
                                  <p>{track_artist}</p>
                              </div>
                          </div>
                      ))
                  }
                  <button onClick={() => setPageIndex(pageIndex + 10)}>Next page</button>
          </div>
      )
  }
  return null
};

export default Tracks;
