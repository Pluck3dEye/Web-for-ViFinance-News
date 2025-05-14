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
      fixed left-0 top-0 h-full z-40
      w-1/2 md:w-1/6
      shadow-md-lg
      flex flex-col justify-between
    `}>
      <ul className="mt-20 mb-6 space-y-2 py-5 px-3 flex-1 overflow-y-auto min-h-[20vh] max-h-[70vh]">
        {user ? (
          <>
            <li className="mb-4 text-base text-gray-900 dark:text-white text-center">
              {user.userName || user.email || user.userId}
            </li>
            <li>
              <a
                href="/profile"
                className="block rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm"
                onClick={onClose}
              >
                <i className="fas fa-user mr-2"></i>Profile Page
              </a>
            </li>
            <li>
              <a
                href="/saved-articles"
                className="block rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white  shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm"
                onClick={onClose}
              >
                <i className="fas fa-bookmark mr-2"></i>Saved Articles
              </a>
            </li>
            <li>
              <a
                href="/settings"
                className="block rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white  shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm"
                onClick={onClose}
              >
                <i className="fas fa-cog mr-2"></i>Settings
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white  shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <a href="/login" className="block rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm"><i className="fas fa-sign-in-alt mr-2"></i>Sign In / Sign Up</a>
          </li>
        )}
        <li><hr className="my-2 border-t-2 border-gray-300 dark:border-gray-600 sm:hidden" /></li>
        <li className="block md:hidden">
          <a href="/" className="block rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white  shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm" onClick={onClose}><i className="fas fa-home mr-2"></i>Home</a>
        </li>
        <li className="block md:hidden">
          <a href="/guide" className="block rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white  shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm" onClick={onClose}><i className="fas fa-info-circle mr-2"></i>Guide</a>
        </li>
        <li className="block md:hidden">
          <a href="/about-us" className="block rounded-md px-3 py-3 mb-1 bg-primary-a0 text-black dark:text-white  shadow-md hover:bg-primary-a20 active:bg-primary-a30 dark:hover:bg-dark-primary-a20 transition-all duration-150 text-sm" onClick={onClose}><i className="fas fa-info-circle mr-2"></i>About Us</a>
        </li>
      </ul>
      <div className="flex justify-center items-end mb-6 w-full">
        <button
          onClick={toggleDarkMode}
          className={`w-12 h-7 bg-lime-300 dark:bg-gray-900 rounded-full flex items-center relative transition-colors duration-300`}
          aria-label="Toggle dark mode"
        >
          <Sun className={`w-4 h-4 absolute left-1 transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-100'}`} />
          <Moon className={`w-4 h-4 absolute right-1 transition-opacity duration-300 ${darkMode ? 'opacity-100' : 'opacity-0'}`} />
          <div className={`w-5 h-5 bg-white rounded-full shadow-md-md transform transition-transform duration-300 ${darkMode ? 'translate-x-1' : 'translate-x-6'}`} />
        </button>
      </div>
    </div>
  );
}

export default HiddenSideNavBar;