import React, { useState } from 'react';
import Graph from './Graph';
import AnotherComponent from './AnotherComponent'; // Import the component where you want to use the list

const App = () => {
  const [selectedCategories, setSelectedCategories] = useState([]); // State to manage selected categories

  return (
    <div>
      <Graph selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
      <AnotherComponent selectedCategories={selectedCategories} />
    </div>
  );
};

export default App;
