import React from 'react';

function TopNavBar({ onMenuClick, menuButtonRef, visible }) {
    return (
      <nav
  className={`top-nav-bar fixed top-0 left-0 w-full px-6 py-3 flex items-center z-50 bg-primary-a10 dark:bg-dark-primary-a10 transition-transform duration-300 ${
    visible ? 'translate-y-0' : '-translate-y-full'
  }`}
>

        <button ref={menuButtonRef} onClick={onMenuClick} className="border border-white dark:border-black px-3 py-1 rounded">☰</button>
        <a href="#" className="ml-3 text-lg font-bold">ViFinanceNews</a>
        <div className="hidden md:block ml-5">
          <input type="text" placeholder="Search..." className="w-96 px-3 py-1 border rounded bg-white dark:bg-gray-100 text-black" />
        </div>
        <div className="md:hidden ml-3">
          <a href="#" className=" text-lg">
            <i className="fas fa-search"></i>
          </a>
        </div>
      </nav>
    );
  }

  export default TopNavBar;