// Graph.js
import React, { useState } from 'react';
import KnowledgeGraph from './KnowledgeGraph';
import TwoDGraph from './TwoDGraph'; // Import the 2D graph component
import TileContainer from './TileContainer';
import AdditionalComponent from './AdditionalComponent';
import CheckboxList from './CheckboxList'; // Import the CheckboxList component

const Graph = ({ selectedCategories, setSelectedCategories }) => {
  const [show3DGraph, setShow3DGraph] = useState(true);

  const toggleGraph = () => {
    setShow3DGraph(!show3DGraph);
  };

  const handleSelectionChange = (selectedItems) => {
    setSelectedCategories(selectedItems); // Update the selected categories
  };

  const items = ['Option 1', 'Option 2', 'Option 3']; // List of items for the checkbox list

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <TileContainer>
        <div style={styles.content}>
          <div style={styles.left}>
            <CheckboxList items={items} onSelectionChange={handleSelectionChange} /> {/* Add the CheckboxList component */}
            <AdditionalComponent />
          </div>
          <div style={styles.right}>
            {show3DGraph ? (
              <KnowledgeGraph width="100%" height="100%" selectedCategories={selectedCategories} />
            ) : (
              <TwoDGraph width="100%" height="100%" />
            )}
          </div>
        </div>
        <button onClick={toggleGraph} style={styles.toggleButton}>
          {show3DGraph ? 'Show 2D Graph' : 'Show 3D Graph'}
        </button>
      </TileContainer>
    </div>
  );
};

const styles = {
  content: {
    display: 'flex',
    flexDirection: 'row', // Layout components side by side
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column', // Stack components vertically
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    height: '100%', // Ensure the left side occupies full height
  },
  right: {
    flex: 2, // Adjust the flex value to control the width of the iframe
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    height: '100%', // Ensure the right side occupies full height
  },
  toggleButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: 'white', // Change the background color to white
    border: '1px solid #ccc', // Add a border if needed
    borderRadius: '5px', // Optional: add rounded corners
  },
};

export default Graph;
