import React, { useState } from 'react';

const SearchResource = ({ handleSearch }) => {
  const [searchUserId, setSearchUserId] = useState('');

  const handleSearchUserIdChange = (e) => {
    setSearchUserId(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(searchUserId);
  };

  return (
    <div className="search-resource">
      <h2>Search Resource</h2>
      <div className="form-group">
        <label htmlFor="searchUserId">User ID (Email)</label>
        <input
          type="email"
          id="searchUserId"
          value={searchUserId}
          onChange={handleSearchUserIdChange}
          required
        />
      </div>
      <button type="button" onClick={handleSearchClick}>
        Search
      </button>
    </div>
  );
};

export default SearchResource;
