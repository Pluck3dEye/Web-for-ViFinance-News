import React, { useState, useEffect, useRef } from 'react';


// Test
import MainHeader from './components/MainHeader.jsx';
import TopNavBar from './components/TopNavBar.jsx';
import HiddenSideNavBar from './components/HiddenSideNavBar.jsx';

import RelevantArticles from './components/RelevantArticles.jsx';
import AuthTabs from './components/AuthTabs.jsx';
import UserProfilePage from './components/UserProfilePage.jsx';
import AnalysisPage from './components/AnalysisPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import AboutUs from './components/AboutUs.jsx';

import useDarkMode from './hooks/useDarkMode.js';
import { useScrollDirection } from './hooks/userScrollDirection.js';



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

function MainContent() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 dark: p-4">
      <h2 className="text-xl font-bold">Main Content</h2>
      <div className="bg-white dark:bg-black dark: p-4">
        This should switch based on dark mode.
      </div>
      <p>This is the main content area.</p>
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

function App() {
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
          <LeftSideContent />
        </div>
        <div className="md:w-4/6">
          <MainHeader />
          <RelevantArticles />
          <AuthTabs />
          <UserProfilePage />
          <AnalysisPage />
          <SettingsPage />
          <AboutUs />
        </div>
        <div className="md:w-1/6">
          <RightSideContent />
        </div>
      </div>
      <Footer />
      </div>
    </>
  );
}

export default App;
