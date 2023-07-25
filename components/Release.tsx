import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';

  const Release = () => {
    const { title } = useParams();
    const { data, error, isValidating } = useFrappeGetDoc<ReleaseItem>('Release', title);
  
    if (isValidating) {
      return <>Loading...</>
    }
  
    if (error) {
      return <>{JSON.stringify(error)}</>
    }
  
    if (data) {
      return (
        <div>
          <h1>{data.title}</h1>
          <p>{data.release_artist}</p>
          <p>{data.release_date}</p>
          <p>{data.release_label}</p>
          <div>{data.release_description}</div>
          {data.release_tracks.map((track, index) => (
            <Track key={index} track={track} index={index} />
          ))}
          <div>{data.release_credits}</div>
        </div>
      )
    }
  
    return null;
  };
  
  export default Release;