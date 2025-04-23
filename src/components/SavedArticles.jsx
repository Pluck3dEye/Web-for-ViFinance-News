import React, { useState } from "react";

const dummyArticles = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: `Saved Article ${i + 1}`,
  description: "This is a saved article description.",
  image: "https://via.placeholder.com/150",
}));

const ARTICLES_PER_PAGE = 5;

export default function SavedArticles() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(dummyArticles.length / ARTICLES_PER_PAGE);

  const articlesToShow = dummyArticles.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4 transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
        Saved Articles
      </h1>
      <div className="w-20 h-1 bg-black dark:bg-white mx-auto mb-8 rounded"></div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {articlesToShow.map((article) => (
          <div
            key={article.id}
            className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={article.image}
              alt="Article Thumbnail"
              className="w-full sm:w-48 h-48 object-cover"
            />
            <div className="p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {article.description}
                </p>
              </div>
              <p className="mt-4 text-primary-a0 dark:text-primary-a20 hover:underline cursor-pointer self-start">
                Read more →
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          className="px-4 py-2 rounded bg-lime-500 text-white disabled:bg-gray-400"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Prev
        </button>
        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded bg-lime-500 text-white disabled:bg-gray-400"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
