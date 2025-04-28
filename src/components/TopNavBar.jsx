import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticleSearch } from '../hooks/useArticleSearch';

function TopNavBar({ onMenuClick, menuButtonRef, visible }) {
    const navigate = useNavigate();
    const { search, setSearch, handleSearch } = useArticleSearch("");
    return (
      <nav
        className={`top-nav-bar fixed top-0 left-0 w-full px-6 py-3 flex items-center z-50 bg-primary-a10 dark:bg-dark-primary-a10 transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button ref={menuButtonRef} onClick={onMenuClick} className="bg-primary-a0 hover:bg-primary-a20 px-3 py-1 rounded text-2xl transition">☰</button>
        <a href="/" className="ml-3 text-lg font-bold">ViFinanceNews</a>
        <div className="hidden md:flex ml-5 items-center gap-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-96 px-3 py-1 border rounded bg-white dark:bg-gray-100 text-black"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {/* No Search button, search on Enter only */}
          </form>
          <button
            className="ml-2 px-4 py-2 bg-primary-a0 text-black dark:text-white rounded hover:bg-primary-a20 transition"
            onClick={() => navigate('/')} type="button"
          >
            Home
          </button>
          <button
            className="ml-2 px-4 py-2 bg-primary-a0 text-black dark:text-white rounded hover:bg-primary-a20 transition"
            onClick={() => navigate('/about-us')} type="button"
          >
            About Us
          </button>
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