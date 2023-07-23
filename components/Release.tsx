import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';

const Release = () => {
  const { title, artist } = useParams();
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title); // assuming 'title' can be used to fetch a single ReleaseItem

  useEffect(() => {
    // do something when title or artist changes, such as fetch related data
  }, [title, artist]);

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
        <h1>{data.title}</h1>
        <p>{data.release_artist}</p>
        <img src={data.release_artwork} alt={data.title} />
        {/* Add more fields as necessary */}
      </div>
    )
  }

  return null;
};

export default Release;
