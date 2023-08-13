import React, { useState } from 'react';

const CreateRelease = () => {
  const [tracks, setTracks] = useState([]);

  const addTrack = () => {
    // Adding an empty track object to the tracks array
    setTracks([...tracks, {}]);
  };

  return (
    <div className="content">
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
            <input id="release_artist" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_label">Release Label</label>
            <input id="release_label" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_type">Release Type</label>
            <input id="release_type" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_artwork">Release Artwork URL</label>
            <input id="release_artwork" type="url" className="block w-full px-4 py-2 mt-2" />
          </div>
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
            <label className="text-gray-700 dark:text-gray-200" htmlFor="price_erg">Ergo Address</label>
            <input id="release_ergo_address" type="number" step="0.01" className="block w-full px-4 py-2 mt-2" />
          </div>
          {/* ... Additional fields ... */}
        </div>

         {/* Tracks Table */}
         <h2 className="mt-4">Tracks</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              {/* Table headers based on track fields */}
              <th className="border px-4 py-2">Track Number</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Artist</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">WAV File</th>
              <th className="border px-4 py-2">Price (USD)</th>
              <th className="border px-4 py-2">Price (ERG)</th>
              <th className="border px-4 py-2">Published</th>
            </tr>
          </thead>
          <tbody>
  {tracks.map((track, idx) => (
    <tr key={idx}>
      <td className="border px-4 py-2">
        <input type="number" name="track_number" value={track.track_number || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_number = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border px-4 py-2">
        <input type="text" name="title" value={track.title || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].title = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border px-4 py-2">
        <input type="text" name="track_artist" value={track.track_artist || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_artist = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border px-4 py-2">
        <input type="text" name="track_type" value={track.track_type || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_type = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border px-4 py-2">
        <input type="file" name="attach_wav" value={track.attach_wav || ''} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].track_type = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border px-4 py-2">
        <input type="number" step="0.01" name="price_usd" value={track.price_usd || 0} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].price_usd = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border px-4 py-2">
        <input type="float" step="0.0001" name="price_erg" value={track.price_erg || 0} onChange={(e) => {
          let newTracks = [...tracks];
          newTracks[idx].price_erg = e.target.value;
          setTracks(newTracks);
        }} />
      </td>
      <td className="border px-4 py-2">
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
        <button type="button" onClick={addTrack} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Add Track</button>

        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Save</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRelease;