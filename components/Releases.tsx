import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types';
import { Link } from "react-router-dom";

const Releases = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<ReleaseItem>('Release' , {
      fields: ["title", "release_artist","release_artwork"],
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
                      data.map(({title, release_artist, release_artwork}, i) => (
                          <div key={i} className="album-card" style={{backgroundImage: `url(${release_artwork})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                          <div className="album-text">
                                  <h4>{title}</h4>
                                  <p>{release_artist}</p>
                                  <Link to={`/releases/${title}`}>View Release</Link>
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

export default Releases;
