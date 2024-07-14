// SearchBar.js
import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    console.log('SearchBar rendered');
  });

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl">
      <div className="flex items-center py-3 bg-black rounded-full">
        <input
          className="appearance-none bg-black border-none w-full text-white text-lg py-2 px-6 leading-tight focus:outline-none rounded-l-full"
          type="text"
          placeholder="How can we achieve interstellar travel..."
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
        />
        <button
          style={{ marginRight: '10px' }}
          className="flex-shrink-0 bg-gray-400 hover:bg-gray-500 text-black hover:text-gray-700 text-lg font-semibold py-2 px-6 rounded-full margin-right: 100px;"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
