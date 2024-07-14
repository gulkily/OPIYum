import React, { useState } from 'react';
import Graph from './Graph';

const HigherApp = () => {
  const [selectedCategories, setSelectedCategories] = useState([]); // State to manage selected categories

  return (
    <div>
      <Graph selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
    </div>
  );
};

export default HigherApp;
