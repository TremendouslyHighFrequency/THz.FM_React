import React from 'react';

const CreateRelease = () => {
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
            <label className="text-gray-700 dark:text-gray-200" htmlFor="zip_file_path">ZIP File Path</label>
            <input id="zip_file_path" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          {/* ... Additional fields ... */}
        </div>

        {/* Track Details */}
        <h2 className="mt-4">Tracks</h2>
        {/* For simplicity, I'm including fields for only one track. */}
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="track_title_1">Track Title</label>
            <input id="track_title_1" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="track_artist_1">Track Artist</label>
            <input id="track_artist_1" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="track_type_1">Track Type</label>
            <input id="track_type_1" type="text" className="block w-full px-4 py-2 mt-2" />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="attach_mp3_1">Attach MP3</label>
            <input id="attach_mp3_1" type="file" className="block w-full px-4 py-2 mt-2" />
          </div>
          {/* ... Additional fields for track ... */}
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
