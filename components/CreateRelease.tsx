import React, { useState, useEffect } from 'react';
import { useFrappeGetDocList, useFrappeFileUpload } from 'frappe-react-sdk';
import { getLoggedUser } from './api';
import { useNavigate } from 'react-router-dom';

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
  const { data: userLabels, error } = useFrappeGetDocList('Label', {
    fields: ["title"],
    filters: loggedUser ? { "owner": loggedUser } : null, // Filter by the owner
    limit: 50,
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  // Fetch artists owned by the logged-in user
const { data: userArtists, error: artistError } = useFrappeGetDocList('Artist', {
  fields: ["name"],  // assuming 'name' is a field in the 'Artist' doctype
  filters: loggedUser ? { "owner": loggedUser } : null, 
  limit: 50,
  orderBy: {
    field: "creation",
    order: 'desc'
  }
});

// Fetch release types
const { data: userReleaseTypes, error: releaseTypeError } = useFrappeGetDocList('Release Type', {
  fields: ["name"],  // assuming 'type' is a field in the 'ReleaseType' doctype
  limit: 50,
  orderBy: {
    field: "creation",
    order: 'desc'
  }
});
const handleSubmit = (e) => {
  e.preventDefault();

  const formattedTracks = tracks.map(track => ({
    track_number: track.track_number,
    track_title: track.title,
    track_artist: track.track_artist,
    track_type: track.track_type,
    attach_wav: track.attach_wav,  // This may need further processing if you want to upload the file to Frappe
    price_usd: parseFloat(track.price_usd),
    price_erg: parseFloat(track.price_erg),
    published: track.published,
    // Add other fields as necessary
    doctype: "Track"
  }));

  const releaseData = {
    title: document.getElementById('title').value,
    release_id: document.getElementById('release_id').value,
    release_artist: document.getElementById('release_artist').value,
    release_label: document.getElementById('release_label').value,
    release_type: document.getElementById('release_type').value,
    release_artwork: document.getElementById('release_artwork').files[0], // Assuming it's a file input
    release_description: document.getElementById('release_description').value,
    release_date: document.getElementById('release_date').value,
    price_usd: parseFloat(document.getElementById('price_usd').value),
    price_erg: parseFloat(document.getElementById('price_erg').value),
    release_ergo_address: document.getElementById('release_ergo_address').value,
    release_tracks: formattedTracks
  };

    // Using the fetch API instead of the hook
    fetch(`https://thz.fm/api/resource/Release`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(releaseData),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Successfully created release:", data);
      useNavigate('/manage-releases');
      // Consider resetting your component state here or redirecting the user
    })
    .catch(error => {
      console.error("Error creating release:", error);
      setFetchError(error.message);
    });
  };

useEffect(() => {
  if (userArtists) {
    setArtists(userArtists.map(artist => artist.name));
  } else if (artistError) {
    setFetchError(artistError);
  }

  if (userReleaseTypes) {
    setReleaseTypes(userReleaseTypes.map(releaseType => releaseType.name));
  } else if (releaseTypeError) {
    setFetchError(releaseTypeError);
  }
}, [userArtists, artistError, userReleaseTypes, releaseTypeError]);
  
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
            <label className=" text-gray-700" htmlFor="title">Title</label>
            <input id="title" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className=" text-gray-700" htmlFor="release_id">Release ID</label>
            <input id="release_id" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
          <label className=" text-gray-700" htmlFor="release_artist">Release Artist</label>
          <select id="release_artist" className="block w-full px-4 py-2 mt-2">
            {artists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>
        </div>
        <div>
          <label className=" text-gray-700" htmlFor="release_label">Release Label</label>
          <select id="release_label" className="block w-full px-4 py-2 mt-2">
            {labels.map(label => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className=" text-gray-700" htmlFor="release_type">Release Type</label>
          <select id="release_type" className="block w-full px-4 py-2 mt-2">
            {releaseTypes.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        <div>
            <label className=" text-gray-700" htmlFor="release_artwork">Release Artwork</label>
            <input id="release_artwork" type="file" className="block w-full px-4 py-2 mt-2" />
            </div>
          <div>
            <label className=" text-gray-700" htmlFor="release_description">Release Description</label>
            <textarea id="release_description" className="block w-full px-4 py-2 mt-2"></textarea>
          </div>
          <div>
            <label className=" text-gray-700" htmlFor="release_date">Release Date</label>
            <input id="release_date" type="date" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className=" text-gray-700" htmlFor="price_usd">Price (USD)</label>
            <input id="price_usd" type="number" step="0.01" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className=" text-gray-700" htmlFor="price_erg">Price (ERG)</label>
            <input id="price_erg" type="number" step="0.01" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className=" text-gray-700" htmlFor="release_ergo_address">Ergo Address</label>
            <input id="release_ergo_address" type="text" step="0.0001" className="block w-full px-4 py-2 mt-2" />
          </div>
          {/* ... Additional fields ... */}
        </div>

         {/* Tracks Table */}
         <h2 className="mt-4">Tracks</h2>
        <table className="min-w-full divide-y divide-gray-200 rounded-md">
          <thead className="bg-gray-50">
            <tr className="px-12 bg-gray-50">
              {/* Table headers based on track fields */}
              <th className="align-middle text-center border w-4"> </th>
              <th className="align-middle text-center border w-4">Track Number</th>
              <th className="align-middle text-center border w-12">Title</th>
              <th className="align-middle text-center border w-12">Artist</th>
              <th className="align-middle text-center border w-12">Type</th>
              <th className="align-middle text-center border w-12">WAV File</th>
              <th className="align-middle text-center border w-6">Price (USD)</th>
              <th className="align-middle text-center border w-6">Price (ERG)</th>
              <th className="align-middle text-center border w-4">Published</th>
            </tr>
          </thead>
          <tbody>
  {tracks.map((track, idx) => (
    <tr key={idx} className="bg-gray-50 w-4">
          <td className="border">
                <input type="checkbox" checked={!!selectedTracks[idx]} onChange={(e) => handleTrackSelection(idx, e.target.checked)} />
              </td>
      <td className="border">
        <input className="bg-gray-50 w-4" type="number" name="track_number" value={track.track_number || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_number = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input className="bg-gray-50 w-12" type="text" name="title" value={track.title || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].title = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input className="bg-gray-50 w-12" type="text" name="track_artist" value={track.track_artist || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_artist = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
        <input className="bg-gray-50 w-12" type="text" name="track_type" value={track.track_type || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_type = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border">
    <input className="bg-gray-50 w-12" type="file" name="attach_wav" onChange={(e) => {
        let newTracks = [...tracks];
        newTracks[idx].attach_wav = e.target.files[0]; // Adjusted for file input
        setTracks(newTracks);
    }} />
</td>
      <td className="border w-6">
        <input className="bg-gray-50" type="number" step="0.01" name="price_usd" value={track.price_usd || 0} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].price_usd = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border w-6">
    <input className="bg-gray-50" type="number" step="0.0001" name="price_erg" value={track.price_erg || 0} onChange={(e) => {
        let newTracks = [...tracks];
        newTracks[idx].price_erg = e.target.value;
        setTracks(newTracks);
    }} />
</td>
      <td className="border w-4">
        <input className="bg-gray-50" type="checkbox" name="published" checked={track.published === "1"} onChange={(e) => {
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
          <button onClick={handleSubmit} className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Save</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRelease;