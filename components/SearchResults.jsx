// SearchResults.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      {results.length > 0 && (
        <div className="search-dropdown show">
          {results.map((result, index) => (
            <div key={index} className="navbar-dropdown-item">
              <Link to={`/releases/${title}/by/${release_artist}/${name}`}>
              <p>{result.title}</p>
            </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;