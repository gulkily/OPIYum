// components/Home.jsx
import React from 'react';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();
  const handleSearch = (query) => {
    console.log(`Search query: ${query}`);
    navigate('/graph');
  };
  return (
    <div>
      <h1 style={{
        color: 'white',
        textAlign: 'center',
        fontSize: '4rem',  // Larger font size
        fontWeight: 'bold',
        marginBottom: '40px'  // More space below the title
      }}>
        Curated for your Curiosity
      </h1>
      <SearchBar onSearch={handleSearch} />

    </div>
  );
};

export default Home;
