import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-black p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl">Limitless</div>
        <ul className="flex space-x-4">
          <li><a href="#" className="text-white hover:text-gray-300">Home</a></li>
          <li><a href="#" className="text-white hover:text-gray-300">exlore</a></li>
          <li><a href="#" className="text-white hover:text-gray-300">community</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
