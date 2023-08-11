// SearchResults.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
  console.log("Results:", results); // Log the entire results array to the console

  return (
    <div className="search-results">
      {results.length > 0 && (
        <div className="search-dropdown show">
          {results.map((result, index) => (
            <div key={index} className="navbar-dropdown-item">
              <Link to={`/releases/${result.title}/by/${result.release_artist}/${result.name}`}>
                <p>{result.title}</p>
                <p>{result.release_artist}</p> {/* Display other attributes to see if they are present */}
                <p>{result.name}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;