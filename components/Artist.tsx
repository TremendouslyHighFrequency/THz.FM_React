import React, { useEffect, useState } from 'react';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';

const Single = () => {
  const title = frappe.get_route()[2]; // assuming 'title' is the third part of your route
  const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title); // assuming 'title' can be used to fetch a single ReleaseItem

  useEffect(() => {
    // do something when title changes, such as fetch related data
  }, [title]);

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

export default Single;
