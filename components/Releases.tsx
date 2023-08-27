import React, { useState } from 'react';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { ReleaseItem } from '../types';
import { Link } from "react-router-dom";
import ReleaseFeature from './ReleaseFeature';

const Releases = () => {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const { data, error, isValidating } = useFrappeGetDocList<ReleaseItem>('Release', {
    fields: ["title", "release_artist", "release_artwork", "name", "published"],
    limit_start: pageIndex,
    limit: 50,
    filters: {
      published: 1
    },
    orderBy: {
      field: "creation",
      order: 'desc'
    }
  });

  if (isValidating) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{JSON.stringify(error)}</>;
  }
  
  if (data && Array.isArray(data)) {
    return (
      <div className="flex flex-col h-screen"> {/* This is the parent container */}
        <ReleaseFeature />
        <div className="flex-grow flex flex-col w-screen text-gray-800">
          {/* Grid for releases */}
          <div className="grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-12 w-full mt-4 overflow-y-auto">
           {data.map(release => (
            <div key={release.name} className="w-96">
              <Link 
                to={`/releases/${release.title}/by/${release.release_artist}/${release.name}`} 
                className="block h-96 rounded-lg shadow-lg bg-white" 
                style={{ backgroundImage: `url('${release.release_artwork}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              ></Link>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <Link to={`/releases/${release.title}/by/${release.release_artist}/${release.name}`} className="font-medium">{release.title}</Link>
                  <Link to={`/releases/${release.title}/by/${release.release_artist}/${release.name}`} className="flex items-center">
                    <span className="text-xs font-medium text-gray-600">by</span>
                    <span className="text-xs font-medium ml-1 text-indigo-500">{release.release_artist}</span>
                  </Link>
                </div>
                {/* <div className="flex space-x-4">
                  <span>❤️</span> {/* Replace with heart SVG icon */}
                  <span>🛒</span> {/* Replace with cart SVG icon */}
                </div> */}
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
