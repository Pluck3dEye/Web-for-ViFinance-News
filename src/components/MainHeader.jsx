import './../MainHeader.css'

function MainHeader() {
  return (
    <header className=" text-gray-900 dark:text-white shadow-sm shadow-amber-100 pb-10">
      <h1 className="text-center py-10 text-4xl font-bold tracking-wide text-primary-a0">
        ViFinance<span className="text-gray-800 dark:text-white">News</span>
      </h1>

      <div className="bg-gray-100 dark:bg-gray-800 w-11/12 md:w-3/5 mx-auto p-4 md:p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search articles, topics..."
          className="flex-1 p-3 text-base rounded-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-primary-a0 transition"
        />
        <button className="bg-primary-a0 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-a10 transition">
          Search ✕
        </button>
      </div>

      <div className="bg-gray-200 dark:bg-gray-700 w-11/12 md:w-2/3 mx-auto mt-10 p-6 rounded-xl shadow-sm text-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
          Suggested Topics
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Investing", "Markets", "Cryptocurrency", "Startups", "Economy", "Stocks"].map((topic) => (
            <span
              key={topic}
              className="bg-white dark:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-pink-200 dark:hover:bg-primary-a0 transition"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

export default MainHeader;