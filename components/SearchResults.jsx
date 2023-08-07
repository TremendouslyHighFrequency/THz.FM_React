// SearchResults.jsx
import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      {results.length > 0 && (
        <div className="search-dropdown show">
          {results.map((result, index) => (
            <div key={index} className="navbar-dropdown-item">
              <p>{result.title} by {result.release_artist}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;