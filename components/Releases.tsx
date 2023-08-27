import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import ReleaseFeature from './ReleaseFeature';
import MeiliSearch from 'meilisearch';

const client = new MeiliSearch({
  host: 'https://index.thz.fm',
  apiKey: '080d55a6dc325a8c912d4f7a0550dc6b3b25b0f195ae25482e99e676fa6d57c8'
});

const index = client.index('releases');

const Releases = () => {
  const [releases, setReleases] = useState([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const searchResults = await index.search('', {
          offset: pageIndex,
          limit: 50
        });
        setReleases(searchResults.hits);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchReleases();
  }, [pageIndex]);

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{JSON.stringify(error)}</>;
  }
  
  if (releases.length > 0) {
    return (
      <div className="flex flex-col h-screen">
        <ReleaseFeature />
        <div className="flex-grow flex flex-col w-screen text-gray-800">
          <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-12 w-full mt-4 overflow-y-auto">
            {releases.map(release => (
              <div key={release.id} className="w-96">
                <Link 
                  to={`/releases/${release.title}/by/${release.release_artist}/${release.id}`} 
                  className="block h-96 rounded-lg shadow-lg bg-white" 
                  style={{ backgroundImage: `url('${release.release_artwork}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></Link>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <Link to={`/releases/${release.title}/by/${release.release_artist}/${release.id}`} className="font-medium">{release.title}</Link>
                    <Link to={`/releases/${release.title}/by/${release.release_artist}/${release.id}`} className="flex items-center">
                      <span className="text-xs font-medium text-gray-600">by</span>
                      <span className="text-xs font-medium ml-1 text-indigo-500">{release.release_artist}</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10 space-x-1">
            <button onClick={() => setPageIndex(prevIndex => prevIndex - 50)} className="flex items-center justify-center h-8 px-2 rounded text-sm font-medium text-gray-400">Prev</button>
            <button onClick={() => setPageIndex(prevIndex => prevIndex + 50)} className="flex items-center justify-center h-8 px-2 rounded hover:bg-indigo-200 text-sm font-medium text-gray-600 hover:text-indigo-600">Next</button>
          </div>
        </div>
      </div>
    )
  }

  return null;
};

export default Releases;
