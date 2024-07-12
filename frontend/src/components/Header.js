import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignout = () => {
    logout(user);
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <img src="/path/to/logo.png" alt="Logo" className="h-10 w-10" />
        </div>
        <nav className="flex flex-grow justify-center">
          <Link to="/home" className="hover:text-gray-400 px-4 py-2">Home</Link>
          <Link to="/about" className="hover:text-gray-400 px-4 py-2">About Us</Link>
          <Link to="/services" className="hover:text-gray-400 px-4 py-2">Services</Link>
          <Link to="/contact" className="hover:text-gray-400 px-4 py-2">Contact Us</Link>
          <Link to="/blog" className="hover:text-gray-400 px-4 py-2">Blog</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon icon={faUserCircle} className="h-8 w-8 cursor-pointer" onClick={toggleSidebar} />
          <FontAwesomeIcon icon={faSignOutAlt} className="h-8 w-8 cursor-pointer" onClick={handleSignout} />
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-gray-900 text-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Profile Menu</h2>
          <button onClick={toggleSidebar} className="text-xl">&times;</button>
        </div>
        <nav className="p-4 space-y-4">
          <Link to="/profile" className="block hover:text-gray-400" onClick={toggleSidebar}>View Profile</Link>
          <button className="block hover:text-gray-400" onClick={handleSignout}>Sign Out</button>
          <Link to="/settings" className="block hover:text-gray-400" onClick={toggleSidebar}>Settings</Link>
          <Link to="/notifications" className="block hover:text-gray-400" onClick={toggleSidebar}>Notifications</Link>
          <Link to="/help" className="block hover:text-gray-400" onClick={toggleSidebar}>Help</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
