import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFrappeGetDoc } from 'frappe-react-sdk'; // assuming this hook exists
import { ReleaseItem } from '../types';
import WaveSurfer from 'wavesurfer.js';

const Track = ({ track, index }) => {
  const waveformRef = useRef(null);
  
  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4F4A85',
      progressColor: '#383351',
    });
    wavesurfer.load(`https://thz.fm${track.attach_mp3}`);
    
    return () => {
      wavesurfer.destroy();
    };
  }, [track]);

  return (
    <div key={index}>
      <p>{track.title}</p>
      <p>{track.artist}</p>
      <div id={`waveform-${index}`} ref={waveformRef}></div>
      <audio id={`audio-${index}`} crossOrigin src={`https://thz.fm${track.attach_mp3}`} type="audio/mpeg"></audio>
    </div>
  );
}

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
        {/* Display the data */}
        <div className="album-page" style={{backgroundImage: `url(${data.release_artwork})`}}>
          <div className="album-page-text">
            <h1>{data.title}</h1>
            <p>{data.release_artist}</p>
            <p>{data.release_date}</p>
            <p>{data.release_label}</p>
            <p>{data.release_description}</p>
            {data.release_tracks.map((track, index) => (
              <Track track={track} index={index} />
            ))}
            <p>{data.release_credits}</p>
          </div>
        </div>
      </div>
    )
  }

  return null;
};

export default Release;
