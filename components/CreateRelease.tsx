import React, { useState, useEffect } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { getLoggedUser } from './api';

const CreateRelease = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState({});
  const [labels, setLabels] = useState([]);
  const [artists, setArtists] = useState([]);
  const [releaseTypes, setReleaseTypes] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch the logged-in user
  useEffect(() => {
    getLoggedUser().then(user => setLoggedUser(user));
  }, []);

  // Fetch labels owned by the logged-in user
  const { data: userLabels } = useFrappeGetDocList('Label', {
    fields: ["title"],
    filters: loggedUser ? { "owner": loggedUser } : null, // Filter by the owner
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });
  
  // Then, within your useEffect for fetching labels:
  useEffect(() => {
      if (userLabels) {
        setLabels(userLabels.map(label => label.title));
        setIsLoading(false);
      } else if (error) {
        setFetchError(error);
        setIsLoading(false);
      }
  }, [userLabels, error]);

  const addTrack = () => {
    // Adding a track object with auto-incremented track_number to the tracks array
    const newTrack = { track_number: tracks.length + 1 };
    setTracks([...tracks, newTrack]);
};

const handleTrackSelection = (idx, isChecked) => {
  setSelectedTracks(prevState => ({ ...prevState, [idx]: isChecked }));
};

const deleteSelectedTracks = () => {
  setTracks(tracks.filter((_, idx) => !selectedTracks[idx]));
  setSelectedTracks({}); // Reset selected tracks
};

  return (
    <div className="releaseForm">
      <form>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          {/* Release Main Details */}
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="title">Title</label>
            <input id="title" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_id">Release ID</label>
            <input id="release_id" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
          <label className="text-gray-700 dark:text-gray-200" htmlFor="release_artist">Release Artist</label>
          <select id="release_artist" className="block w-full px-4 py-2 mt-2">
            {artists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-700 dark:text-gray-200" htmlFor="release_label">Release Label</label>
          <select id="release_label" className="block w-full px-4 py-2 mt-2">
            {labels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-700 dark:text-gray-200" htmlFor="release_type">Release Type</label>
          <select id="release_type" className="block w-full px-4 py-2 mt-2">
            {releaseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_artwork">Release Artwork URL</label>
            <input id="release_artwork" type="url" className="block w-full px-4 py-2 mt-2" />
         
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_description">Release Description</label>
            <textarea id="release_description" className="block w-full px-4 py-2 mt-2"></textarea>
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_date">Release Date</label>
            <input id="release_date" type="date" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="price_usd">Price (USD)</label>
            <input id="price_usd" type="number" step="0.01" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="price_erg">Price (ERG)</label>
            <input id="price_erg" type="number" step="0.01" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_ergo_address">Ergo Address</label>
            <input id="release_ergo_address" type="text" step="0.01" className="block w-full px-4 py-2 mt-2" />
          </div>
          {/* ... Additional fields ... */}
        </div>

         {/* Tracks Table */}
         <h2 className="mt-4">Tracks</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              {/* Table headers based on track fields */}
              <th className="border"> </th>
              <th className="border">Track Number</th>
              <th className="border">Title</th>
              <th className="border">Artist</th>
              <th className="border">Type</th>
              <th className="border">WAV File</th>
              <th className="border">Price (USD)</th>
              <th className="border">Price (ERG)</th>
              <th className="border">Published</th>
            </tr>
          </thead>
          <tbody>
  {tracks.map((track, idx) => (
    <tr key={idx}>
          <td className="border">
                <input type="checkbox" checked={!!selectedTracks[idx]} onChange={(e) => handleTrackSelection(idx, e.target.checked)} />
              </td>
      <td className="border">
        <input type="number" name="track_number" value={track.track_number || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_number = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input type="text" name="title" value={track.title || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].title = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input type="text" name="track_artist" value={track.track_artist || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_artist = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input type="text" name="track_type" value={track.track_type || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_type = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
  <input type="file" name="attach_wav" value={track.attach_wav || ''} onChange={(e) => {
    let newTracks = [...tracks];
    newTracks[idx].attach_wav = e.target.value; // Corrected here
    setTracks(newTracks);
  }} />
</td>
      <td className="border">
        <input type="number" step="0.01" name="price_usd" value={track.price_usd || 0} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].price_usd = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input type="float" step="0.0001" name="price_erg" value={track.price_erg || 0} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].price_erg = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input type="checkbox" name="published" checked={track.published === "1"} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].published = e.target.checked ? "1" : "0";
          setTracks(newTracks);
        }} />
      </td>
    </tr>
  ))}
</tbody>
        </table>
        <div className="flex mt-4">
        <button type="button" onClick={addTrack} className="px-4 py-2 bg-blue-500 text-white rounded">Add Track</button>
        {Object.values(selectedTracks).some(val => val) && 
          <button type="button" onClick={deleteSelectedTracks} className="ml-4 px-4 py-2 bg-red-500 text-white rounded">Remove Tracks</button>
        }
      </div>
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Save</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRelease;