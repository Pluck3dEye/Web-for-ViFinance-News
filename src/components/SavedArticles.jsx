import React, { useState, useEffect } from "react";
import { API_BASES } from "../config";

export default function SavedArticles() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ARTICLES_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(totalCount / ARTICLES_PER_PAGE));

  useEffect(() => {
    async function fetchSavedArticles() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API_BASES.user}/api/user/saved-articles?page=${page}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setArticles(data.articles || []);
          setTotalCount(data.totalCount || 0);
        } else {
          setError(
            data?.message || data?.error || "Failed to load saved articles"
          );
        }
      } catch {
        setError("Network error");
      }
      setLoading(false);
    }
    fetchSavedArticles();
  }, [page]);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4 transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
        Saved Articles
      </h1>
      <div className="w-20 h-1 bg-black dark:bg-white mx-auto mb-8 rounded"></div>
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {articles.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No saved articles found.
            </div>
          ) : (
            articles.map((article, idx) => (
              <div
                key={article.url || idx}
                className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt="Article Thumbnail"
                    className="w-40 h-28 object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400'; }}
                  />
                )}
                <div className="p-6 flex flex-col justify-between w-full">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {article.title}
                    </h2>
                    {article.brief_des_batches && (
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {article.brief_des_batches}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {article.tags?.map((tag, i) => (
                        <span key={i} className="bg-lime-100 dark:bg-lime-700 text-lime-700 dark:text-lime-100 px-2 py-1 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                    {/* <p className="text-xs text-gray-400 mt-1">
                      {article.author} | {article.date_publish}
                    </p> */}
                    {/* Upvotes display */}
                    {/* {typeof article.upvotes !== 'undefined' && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lime-500 font-bold">▲</span>
                        <span className="text-sm font-semibold">{article.upvotes}</span>
                        <span className="text-xs text-gray-400">Upvotes</span>
                      </div>
                    )} */}
                  </div>
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-primary-a0 dark:text-primary-a20 hover:underline cursor-pointer self-start"
                    >
                      Read more →
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button
          className="px-4 py-2 rounded bg-lime-500 text-white disabled:bg-gray-400"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          ← Prev
        </button>
        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded bg-lime-500 text-white disabled:bg-gray-400"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
