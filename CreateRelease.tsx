import React, { useState } from 'react';
import { useFrappeCreateDoc, useFrappeFileUpload } from 'frappe-react-sdk';
import { Fieldset, Label, Input } from '@radix-ui/react-label';
import { Progress } from '@radix-ui/react-progress';
import { Button } from '@radix-ui/react-collection';
import { useNavigate } from 'react-router-dom';
import lamejs from 'lamejs';

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
    <form onSubmit={handleSubmit}>
      <Fieldset>
        <Label>Title:</Label>
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </Fieldset>
      <Fieldset>
        <Label>Artist:</Label>
        <Input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} />
      </Fieldset>
      <Fieldset>
        <Label>Description:</Label>
        <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Fieldset>
      <Fieldset>
        <Label>Artwork:</Label>
        <Input type="file" accept="image/*" onChange={handleArtworkUpload} />
      </Fieldset>
      <Fieldset>
        <Label>Price USD:</Label>
        <Input type="number" value={priceUsd} onChange={(e) => setPriceUsd(parseFloat(e.target.value))} />
      </Fieldset>
      <Fieldset>
        <Label>Price ERG:</Label>
        <Input type="number" value={priceErg} onChange={(e) => setPriceErg(parseFloat(e.target.value))} />
      </Fieldset>
      <Fieldset>
        <Label>Tracks:</Label>
        <Input type="file" accept="audio/*" multiple onChange={handleTrackUpload} />
      </Fieldset>
      {tracks.map((track, index) => (
        <React.Fragment key={index}>
          <Fieldset>
            <Label>Track Title:</Label>
            <Input type="text" value={track.track_title} onChange={(e) => handleTrackChange(index, 'track_title', e.target.value)} />
          </Fieldset>
          <Fieldset>
            <Label>Track Artist:</Label>
            <Input type="text" value={track.track_artist} onChange={(e) => handleTrackChange(index, 'track_artist', e.target.value)} />
          </Fieldset>
          <Fieldset>
            <Label>Track Type:</Label>
            <Input type="text" value={track.track_type} onChange={(e) => handleTrackChange(index, 'track_type', e.target.value)} />
          </Fieldset>
          <Fieldset>
            <Label>Track MP3:</Label>
            <Input type="file" accept="audio/mp3" onChange={(e) => handleTrackFileChange(index, 'attach_mp3', e)} />
          </Fieldset>
          <Fieldset>
            <Label>Track WAV:</Label>
            <Input type="file" accept="audio/wav" onChange={(e) => handleTrackFileChange(index, 'attach_wav', e)} />
          </Fieldset>
          <Fieldset>
            <Label>Price USD:</Label>
            <Input type="number" value={track.price_usd} onChange={(e) => handleTrackChange(index, 'price_usd', parseFloat(e.target.value))} />
          </Fieldset>
          <Fieldset>
            <Label>Price ERG:</Label>
            <Input type="number" value={track.price_erg} onChange={(e) => handleTrackChange(index, 'price_erg', parseFloat(e.target.value))} />
          </Fieldset>
          <Fieldset>
            <Label>Track Genre:</Label>
            <Input type="text" value={track.track_genre} onChange={(e) => handleTrackChange(index, 'track_genre', e.target.value)} />
          </Fieldset>
        </React.Fragment>
      ))}
      <Button type="button" onClick={handleAddTrack}>Add Track</Button>
      <Progress value={progress} />
      <Button type="submit">Create Release</Button>
    </form>
  );
};

export default CreateRelease;
