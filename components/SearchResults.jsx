// SearchResults.jsx
import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div className="search-results">
      {results.length > 0 && (
        <div className="navbar-dropdown show">
          {results.map((result, index) => (
            <div key={index} className="navbar-dropdown-item">
              <p>{result.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;