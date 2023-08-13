import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateRelease = () => {
  const [userArtists, setUserArtists] = useState([]);
  const [loggedUser, setLoggedUser] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = await getLoggedUser();
      setLoggedUser(user);
      // Fetch user artists here and set to userArtists
      // Example: setUserArtists(await fetchUserArtists(user));
    };
    fetchData();
  }, []);

  return (
    <div className="content">
      <form>
        {/* Release fields */}
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          {/* ... other fields ... */}
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="title">Title</label>
            <input id="title" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          {/* ... */}
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="release_artist">Release Artist</label>
            <select id="release_artist" className="block w-full px-4 py-2 mt-2">
              {userArtists.map(artist => (
                <option key={artist.id} value={artist.name}>{artist.name}</option>
              ))}
            </select>
          </div>
          {/* ... */}
        </div>

        {/* Release Tracks fields */}
        <h2>Tracks</h2>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          {/* Fields for track 1 */}
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="track_title">Track Title</label>
            <input id="track_title" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          {/* ... other track fields ... */}
        </div>

        <div className="flex justify-end mt-6">
          <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">Save</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRelease;