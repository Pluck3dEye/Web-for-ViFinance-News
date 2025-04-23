import React from "react";
import { Sun, Moon } from 'lucide-react';
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";

function HiddenSideNavBar({ isOpen, onClose, darkMode, toggleDarkMode, sidebarRef }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <div
      ref={sidebarRef}
      className={`
      hidden-bar  
      transform transition-transform duration-400 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      fixed left-0 top-15 w-1/6  h-[calc(100vh-3.75rem)] z-40
    `}>
      <button onClick={onClose} className="absolute top-4 right-4   text-xl focus:outline-none">
        &times;
      </button>
      <ul className="mt-16 space-y-4 px-6">
        {user ? (
          <>
            <li className="mb-6 text-lg font-semibold text-gray-900 dark:text-white text-center">
              Hi, {user.name || user.username}
            </li>
            <li>
              <a
                href="/profile"
                className="block hover:underline"
                onClick={onClose}
              >
                Profile Page
              </a>
            </li>
            <li>
              <a
                href="/saved-articles"
                className="block hover:underline"
                onClick={onClose}
              >
                Saved Articles
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="block hover:underline"
                onClick={onClose}
              >
                Settings
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left hover:underline bg-transparent border-none p-0 m-0"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <a href="/login" className="block hover:underline">Sign In / Sign Up</a>
          </li>
        )}
        <li>
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className={`w-14 h-8 bg-lime-300 dark:bg-gray-900 rounded-full flex items-center relative transition-colors duration-300`}
                aria-label="Toggle dark mode"
              >
                {/* Sun Icon - Left side */}
                <Sun
                  className={`w-4 h-4 absolute left-2  transition-opacity duration-300 ${
                    darkMode ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                {/* Moon Icon - Right side */}
                <Moon
                  className={`w-4 h-4 absolute right-2  transition-opacity duration-300 ${
                    darkMode ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                {/* Knob */}
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    darkMode ? 'translate-x-1' : 'translate-x-7'
                  }`}
                />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default HiddenSideNavBar;