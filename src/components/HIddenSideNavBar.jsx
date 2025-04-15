import React from "react";
import { Sun, Moon } from 'lucide-react';

function HiddenSideNavBar({ isOpen, onClose, darkMode, toggleDarkMode, sidebarRef }) {
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
        <li><a href="signin.html" className="block hover:underline">Sign In / Sign Up</a></li>
        <li><a href="article.html" className="block hover:underline">Article</a></li>
        <li><a href="protect.html" className="block hover:underline">Protect</a></li>
        <li>
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleDarkMode}
                className={`w-14 h-8 bg-orange-400 dark:bg-gray-900 rounded-full flex items-center relative transition-colors duration-300`}
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