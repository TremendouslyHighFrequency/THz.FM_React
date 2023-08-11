import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ArtistItem } from '../types';
import { Link } from "react-router-dom";


const Artists = () => {
  const [pageIndex, setPageIndex] = useState<number>(0)
  const { data, error, isValidating } = useFrappeGetDocList<ArtistItem>('Artist' , {
      fields: ["title", "artist_bio","artist_photo"],
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
                      data.map(({title, artist_bio, artist_photo}, i) => (
                          <div key={i} className="album-card" style={{backgroundImage: `url(${artist_photo})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
                          <div className="album-text">
                                  <h4>{title}</h4>
                                  <Link to={`/artists/${title}`}>View Artist</Link>
                              </div>
                          </div>
  
                      ))
                  }

{data.length >= 50 && (
              <button onClick={() => setPageIndex(pageIndex + 50)}>Next page</button>
            )}
            
          </div>
      )
  }
  return null
};

export default Artists;
