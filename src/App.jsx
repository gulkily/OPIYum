import React from 'react';
import Navbar from './components/navbar';
import SearchBar from './components/SearchBar';
import backgroundImage from '/Users/aleezajahan/OPIYum/src/midjourney.png';

function App() {
  return (
    <div className="App" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative' // Ensure the container is relative for absolute positioning of the overlay
    }}>
      {/* Overlay to dim the background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)' // Black overlay with 50% opacity
      }}></div>
      <Navbar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        zIndex: 1 // Ensure the content is on top of the overlay
      }}>
        <h1 style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '4rem',  // Larger font size
          fontWeight: 'bold',
          marginBottom: '40px'  // More space below the title
        }}>
          Curated for your Curiosity
        </h1>
        <SearchBar />
      </div>
      <div className="p-4" style={{ zIndex: 1 }}>
        {/* Your other content here */}
      </div>
    </div>
  );
}

export default App;
