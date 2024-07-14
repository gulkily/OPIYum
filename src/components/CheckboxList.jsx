import React, { useState } from 'react';
import jsonData from './dummy.json'; // Adjust the path as necessary

const CheckboxList = () => {
  const uniqueCategories = getUniqueCategories(jsonData);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter(category => category !== value));
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Select Categories</h3>
      <div style={styles.checkboxGroup}>
        {uniqueCategories.map((category, index) => (
          <div key={index}>
            <label style={styles.label}>
              <input
                type="checkbox"
                value={category}
                onChange={handleCheckboxChange}
                style={styles.checkbox}
              />
              {category}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '20px',
    textAlign: 'left',
  },
  heading: {
    color: 'white',
    fontSize: '24px', // Adjust the size as needed
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '10px',
    color: 'white', // Make the text white
    fontSize: '18px', // Make the words bigger
  },
  checkbox: {
    marginRight: '10px',
  },
};

const getUniqueCategories = (data) => {
  const categories = data.map(item => item.category);
  return [...new Set(categories)];
};

export default CheckboxList;
