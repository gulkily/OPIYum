// App.js
import React from 'react';
import Navbar from './components/navbar';

import backgroundImage from '/Users/aleezajahan/OPIYum/src/midjourney.png';
import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Graph from './components/Graph';
import SimpleGraph from './components/Sigma';
import SigmaGraph from './components/Sigma2';
import SentientAIKnowledgeGraph from './components/2DFinal';

function App() {
  

  return (
    <div className="App" style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
      }}></div>
      <Navbar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        zIndex: 1
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </div>
      <div className="p-4" style={{ zIndex: 1 }}>
        {/* Your other content here */}
      </div>
    </div>
  );
}
export default App;
