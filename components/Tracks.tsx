import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types'; // Change to ReleaseItem type

const Tracks = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<ReleaseItem>('Release' , { // Fetch 'Release' DocType
      fields: ["title", "release_tracks"], // Include 'release_tracks' field
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
                  data.flatMap(({release_tracks}, i) => ( // Use flatMap to create a flat array of track divs
                      release_tracks && release_tracks.map((track, j) => (
                          <div key={`${i}-${j}`} className="track-card" style={{backgroundImage: `url(${track.artwork})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                              <div className="track-text">
                                  <h4>{track.title}</h4>
                                  <p>{track.track_artist}</p>
                              </div>
                          </div>
                      ))
                  ))
              }
              <button onClick={() => setPageIndex(pageIndex + 10)}>Next page</button>
          </div>
      )
  }
  return null
};

export default Tracks;
