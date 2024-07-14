// components/Home.jsx
import React from 'react';
import SearchBar from './SearchBar';

const Home = () => {
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

    </div>
  );
};

export default Home;
