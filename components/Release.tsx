import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';

const Release = () => {
  const { title, artist } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title); // assuming 'title' can be used to fetch a single ReleaseItem

  useEffect(() => {
    // do something when title or artist changes, such as fetch related data
  }, ["title", "release_id", "release_artwork", "release_artist", "release_label", "release_description", "release_tracks[]", "release_credits", "release_date"]);

  if (isValidating) {
    return <>Loading...</>
  }

  if (error) {
    return <>{JSON.stringify(error)}</>
  }

  if (data) {
    return (
      <div>
        {/* Display the data */}
        <div className="album-page" style={{backgroundImage: `url(${data.release_artwork})`}}>
        <div className="album-page-text">
        <h1>{data.title}</h1>
        <p>{data.release_artist}</p>
        <p>{data.release_date}</p>
        <p>{data.release_label}</p>
        <div>{data.release_description}</div>
       <div>
        {data.release_tracks.map((track, index) => (
          <div key={index}>
            <p>{track.title}</p>
            <p>{track.artist}</p>
            <p>https://thz.fm{track.attach_mp3}</p>
          </div>
        ))}
        </div>
        <div>{data.release_credits}</div>
        </div>
        </div>
      </div>
    )
  }

  return null;
};

export default Release;
