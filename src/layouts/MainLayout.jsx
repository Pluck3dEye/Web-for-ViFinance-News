import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';

import TopNavBar from './../components/TopNavBar.jsx';
import HiddenSideNavBar from './../components/HiddenSideNavBar.jsx';

import useDarkMode from './../hooks/useDarkMode.js';
import { useScrollDirection } from './../hooks/userScrollDirection.js';



function RightSideContent() {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 dark: p-4">
      <h2 className="text-xl font-bold">Right Side Content</h2>
      <p>This is the right side content.</p>
    </div>
  );
}

function LeftSideContent() {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 dark: p-4">
      <h2 className="text-xl font-bold">Left Side Content</h2>
      <p>This is the left side content.</p>
    </div>
  );
}

function Footer() {
    return (
      <footer className="footer p-4 text-center">
        <p>&copy; 2025 ViFinanceNews</p>
      </footer>
    );
  }

function MainLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(
    (prev) => !prev
  );

  const closeSidebar = () => setSidebarOpen(false);

  const { darkMode, toggleDarkMode } = useDarkMode();

  // Ref for the sidebar
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        closeSidebar();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  // Keyboard shortcut: Press "N" to toggle sidebar if not in input/textarea/select
  useEffect(() => {
    function handleKeyDown(e) {
      if (
        e.key === "s" || e.key === "S"
      ) {
        const tag = document.activeElement.tagName;
        if (
          tag !== "INPUT" &&
          tag !== "TEXTAREA" &&
          tag !== "SELECT" &&
          !document.activeElement.isContentEditable
        ) {
          e.preventDefault();
          toggleSidebar();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // For the top nav bar hidden when scroll
  const showNav = useScrollDirection();

  return (
    <>
    <div className='app min-h-screen flex flex-col bg-surface-a0 dark:bg-dark-surface-a0 transition-transform duration-400' >  
      <TopNavBar onMenuClick={toggleSidebar} 
                 menuButtonRef={menuButtonRef} 
                 visible={showNav}/>
      <HiddenSideNavBar isOpen={sidebarOpen} 
                        onClose={closeSidebar} 
                        darkMode={darkMode} 
                        toggleDarkMode={toggleDarkMode} 
                        sidebarRef={sidebarRef}/>
      <div className="container mt-24 text-center"></div>
      <div className="flex flex-col flex-grow md:flex-row">
        <div className="md:w-1/6">
          {/* <LeftSideContent /> */}
        </div>
        <div className="md:w-4/6">
          <Outlet />
        </div>
        <div className="md:w-1/6">
          {/* <RightSideContent /> */}
        </div>
      </div>
      <Footer />
      </div>
    </>
  );
}

export default MainLayout;