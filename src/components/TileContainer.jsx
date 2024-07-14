import React from 'react';

const TileContainer = ({ children }) => {
  return (
    <div style={styles.container}>
      {children}
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(0, 0, 0, 0.7)', // white background with some transparency
    borderRadius: '10px', // rounded corners
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // subtle shadow
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80vw',
    height: '80vh',
    margin: 'auto', // center the tile
  },
};

export default TileContainer;
