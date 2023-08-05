import React, { useState } from 'react';
import { useFrappeCreateDoc, useFrappeFileUpload } from 'frappe-react-sdk';
import { Button, Form } from 'react-bootstrap';
import { Progress } from '@radix-ui/react-progress';
import { useNavigate, useHistory } from 'react-router-dom';
import lamejs from 'lamejs';
import 'bootstrap/dist/css/bootstrap.min.css';

type Track = {
  track_number: number;
  track_title: string;
  track_artist: string;
  track_type: string;
  attach_mp3: Promise<File> | null;
  attach_wav: File | null;
  price_usd: number;
  price_erg: number;
  track_genre: string;
}

const CreateRelease = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [artwork, setArtwork] = useState<File | null>(null);
  const [priceUsd, setPriceUsd] = useState(0.0);
  const [priceErg, setPriceErg] = useState(0.0);
  const [tracks, setTracks] = useState<Track[]>([{
    track_number: 1,
    track_title: '',
    track_artist: '',
    track_type: '',
    attach_mp3: null,
    attach_wav: null,
    price_usd: 0,
    price_erg: 0,
    track_genre: '',
  }]);

  const [progress, setProgress] = useState(0);

  const createDoc = useFrappeCreateDoc();
  const fileUpload = useFrappeFileUpload();

  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArtwork(e.target.files[0]);
    }
  };

  const handleTrackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setTracks(prevTracks => files.map((file, i) => ({
        ...prevTracks[i],
        attach_mp3: file.name.endsWith('.mp3') ? Promise.resolve(file) : null,
        attach_wav: file.name.endsWith('.wav') ? file : null,
      })));
    }
  };
  
  const handleTrackChange = (index: number, field: keyof Track, value: any) => {
    setTracks(prevTracks => prevTracks.map((track, i) => i === index ? {
      ...track,
      [field]: value,
    } : track));
  };

  const handleAddTrack = () => {
    setTracks(prevTracks => [
      ...prevTracks,
      {
        track_number: prevTracks.length + 1,
        track_title: '',
        track_artist: '',
        track_type: '',
        attach_mp3: null,
        attach_wav: null,
        price_usd: 0,
        price_erg: 0,
        track_genre: '',
      }
    ]);
  };

  const handleTrackFileChange = (index: number, field: keyof Track, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (field === 'attach_wav') {
        const reader = new FileReader();
        reader.onload = function(event) {
          const data = new Uint8Array(event.target!.result as ArrayBuffer);
          const wav = lamejs.WavHeader.readHeader(new DataView(data.buffer));
          const mp3Encoder = new lamejs.Mp3Encoder(wav.channels, wav.sampleRate, 256);
          const samples = new Int16Array(data.buffer, wav.dataOffset, wav.dataLen / 2);
          const mp3Data = mp3Encoder.encodeBuffer(samples);
          const blob = new Blob([new Uint8Array(mp3Data)], { type: 'audio/mpeg' });
          const mp3File = new File([blob], file.name.replace('.wav', '.mp3'), { type: 'audio/mpeg' });
          handleTrackChange(index, 'attach_mp3', Promise.resolve(mp3File));
        };
        reader.readAsArrayBuffer(file);
      } else {
        handleTrackChange(index, field, file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload artwork
    let artworkUrl = '';
    if (artwork) {
      const { url } = await fileUpload(artwork, (progressEvent) => {
        setProgress((progressEvent.loaded / progressEvent.total) * 100);
      });
      artworkUrl = url;
    }

    // Upload tracks and create track objects
    const trackObjs = [];
    for (const track of tracks) {
      const trackMp3File = await track.attach_mp3!; // Await the MP3 file Promise
      const trackMp3Url = await fileUpload(trackMp3File, (progressEvent) => {
        setProgress((progressEvent.loaded / progressEvent.total) * 100);
      });
      const trackWavUrl = await fileUpload(track.attach_wav!, (progressEvent) => {
        setProgress((progressEvent.loaded / progressEvent.total) * 100);
      });
      trackObjs.push({
        track_number: track.track_number,
        track_title: track.track_title,
        track_artist: track.track_artist,
        track_type: track.track_type,
        attach_mp3: trackMp3Url.url,
        attach_wav: trackWavUrl.url,
        price_usd: track.price_usd,
        price_erg: track.price_erg,
        track_genre: track.track_genre,
        parentfield: "release_tracks",
        parenttype: "Release",
        doctype: "Track",
      });
    }

    // Create release document
    const releaseData = {
      title,
      release_artist: artist,
      release_artwork: artworkUrl,
      release_description: description,
      artist_featured: 0,
      price_usd: priceUsd,
      price_erg: priceErg,
      doctype: "Release",
      release_credits: [],
      release_genres: [],
      release_tracks: trackObjs,
    };
    const navigate = useNavigate();

    createDoc('Release', releaseData)
      .then((doc) => {
        console.log(doc);
        navigate('/success'); // Navigate to success page or wherever you want
      })
      .catch((error) => console.error(error));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Title:</Form.Label>
        <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Artist:</Form.Label>
        <Form.Control type="text" value={artist} onChange={(e) => setArtist(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description:</Form.Label>
        <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Artwork:</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleArtworkUpload} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Price USD:</Form.Label>
        <Form.Control type="number" value={priceUsd} onChange={(e) => setPriceUsd(parseFloat(e.target.value))} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Price ERG:</Form.Label>
        <Form.Control type="number" value={priceErg} onChange={(e) => setPriceErg(parseFloat(e.target.value))} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Tracks:</Form.Label>
        <Form.Control type="file" accept="audio/*" multiple onChange={handleTrackUpload} />
      </Form.Group>
      {tracks.map((track, index) => (
        <React.Fragment key={index}>
          <Form.Group>
            <Form.Label>Track Title:</Form.Label>
            <Form.Control type="text" value={track.track_title} onChange={(e) => handleTrackChange(index, 'track_title', e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Track Artist:</Form.Label>
            <Form.Control type="text" value={track.track_artist} onChange={(e) => handleTrackChange(index, 'track_artist', e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Track Type:</Form.Label>
            <Form.Control type="text" value={track.track_type} onChange={(e) => handleTrackChange(index, 'track_type', e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Track MP3:</Form.Label>
            <Form.Control type="file" accept="audio/mp3" onChange={(e) => handleTrackFileChange(index, 'attach_mp3', e)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Track WAV:</Form.Label>
            <Form.Control type="file" accept="audio/wav" onChange={(e) => handleTrackFileChange(index, 'attach_wav', e)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price USD:</Form.Label>
            <Form.Control type="number" value={track.price_usd} onChange={(e) => handleTrackChange(index, 'price_usd', parseFloat(e.target.value))} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Price ERG:</Form.Label>
            <Form.Control type="number" value={track.price_erg} onChange={(e) => handleTrackChange(index, 'price_erg', parseFloat(e.target.value))} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Track Genre:</Form.Label>
            <Form.Control type="text" value={track.track_genre} onChange={(e) => handleTrackChange(index, 'track_genre', e.target.value)} />
          </Form.Group>
        </React.Fragment>
      ))}
      <Button variant="primary" type="button" onClick={handleAddTrack}>Add Track</Button>
      <Progress value={progress} />
      <Button variant="primary" type="submit">Create Release</Button>
    </Form>
  );
};

export default CreateRelease;
