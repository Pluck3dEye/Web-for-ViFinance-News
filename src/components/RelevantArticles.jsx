import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegBookmark, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { API_BASES } from "../config";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RelevantArticles() {
  const query = useQuery().get("query") || "";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState("");
  const [synthLoading, setSynthLoading] = useState(false);
  const [synthesis, setSynthesis] = useState("");
  const [synthError, setSynthError] = useState("");
  const [savingMap, setSavingMap] = useState({}); // { [url]: 'idle' | 'saving' | 'saved' | 'error' }
  const [voteMap, setVoteMap] = useState({}); // { [url]: { loading: false, vote: 0, error: '' } }
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setArticles([]);
      setLoading(false);
      setSynthesis("");
      setSynthError("");
      setSynthLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    setSynthesis("");
    setSynthError("");
    setSynthLoading(false);
    fetch(`${API_BASES.search}/api/get_cached_result`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "success" && Array.isArray(data.data)) {
          setArticles(data.data);
        } else {
          setError("No articles found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Network error.");
        setLoading(false);
      });
  }, [query]);

  const handleSynthesis = async () => {
    setSynthLoading(true);
    setSynthError("");
    setSynthesis("");
    try {
      const urls = articles.map(a => a.url);
      const res = await fetch("/api/synthesis/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(urls)
      });
      const data = await res.json();
      if (res.ok && data.synthesis) {
        setSynthesis(data.synthesis);
      } else {
        setSynthError("No synthesis result.");
      }
    } catch {
      setSynthError("Network error.");
    }
    setSynthLoading(false);
  };

  // Navigate to analysis page
  const handleAnalyze = (article) => {
    navigate("/analysis", {
      state: {
        article
      }
    });
  };

  // Save handler
  const handleSave = async (article) => {
    setSavingMap((prev) => ({ ...prev, [article.url]: "saving" }));
    try {
      const res = await fetch(`${API_BASES.search}/api/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: article.url })
      });
      const data = await res.json();
      if (res.ok && data.message === "success") {
        setSavingMap((prev) => ({ ...prev, [article.url]: "saved" }));
      } else {
        setSavingMap((prev) => ({ ...prev, [article.url]: "error" }));
      }
    } catch {
      setSavingMap((prev) => ({ ...prev, [article.url]: "error" }));
    }
    setTimeout(() => setSavingMap((prev) => ({ ...prev, [article.url]: undefined })), 2000);
  };

  // Vote handler (type: 1 for up, -1 for down)
  const handleVote = async (article, type) => {
    setVoteMap((prev) => ({ ...prev, [article.url]: { ...(prev[article.url] || {}), loading: true, error: '' } }));
    const endpoint = type === 1 ? "/api/get_up_vote" : "/api/get_down_vote";
    try {
      const res = await fetch(`${API_BASES.search}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: article.url, vote_type: type })
      });
      const data = await res.json();
      if (res.ok && data.vote_type === type) {
        setVoteMap((prev) => ({ ...prev, [article.url]: { loading: false, vote: type, error: '' } }));
      } else {
        setVoteMap((prev) => ({ ...prev, [article.url]: { loading: false, vote: prev[article.url]?.vote || 0, error: data?.error || 'Vote failed' } }));
      }
    } catch {
      setVoteMap((prev) => ({ ...prev, [article.url]: { loading: false, vote: prev[article.url]?.vote || 0, error: 'Network error' } }));
    }
    setTimeout(() => setVoteMap((prev) => ({ ...prev, [article.url]: { ...prev[article.url], error: '' } })), 2000);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4 transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
        Relevant Articles
      </h1>
      <div className="w-20 h-1 bg-black dark:bg-white mx-auto mb-8 rounded"></div>

      {/* Synthesis Button and Result */}
      <div className="flex flex-col items-center mb-8">
        <button
          className="px-7 py-2 bg-primary-a0 dark:bg-primary-a20 text-white font-semibold rounded-lg shadow hover:bg-primary-a20 dark:hover:bg-primary-a0 transition-colors duration-200 mb-4 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-a0 dark:focus:ring-primary-a20"
          onClick={handleSynthesis}
          disabled={synthLoading || articles.length === 0}
        >
          {synthLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              Synthesizing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Synthesis
            </span>
          )}
        </button>
        {synthError && <div className="text-red-500 text-center mb-2 font-semibold">{synthError}</div>}
        {synthesis && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow max-w-2xl text-gray-800 dark:text-gray-100 text-center mt-2 animate-fade-in">
            <span className="block text-base font-semibold mb-2 text-primary-a0 dark:text-primary-a20">Synthesis Result</span>
            <span className="block text-base leading-relaxed">{synthesis}</span>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center text-lg text-gray-600 dark:text-gray-300">Loading...</div>
      )}
      {error && (
        <div className="text-center text-red-500 mb-6">{error}</div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {articles.map((article, idx) => {
            const saving = savingMap[article.url];
            const vote = voteMap[article.url]?.vote || 0;
            const voteLoading = voteMap[article.url]?.loading;
            const voteError = voteMap[article.url]?.error;
            const defaultImg = "https://placehold.co/600x400";
            return (
              <div
                key={article.url || idx}
                className="relative flex flex-col sm:flex-row bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                {/* Save icon button, hidden by default, visible on hover */}
                <button
                  className="absolute top-3 right-3 z-20 bg-white/80 dark:bg-gray-700/80 text-primary-a0 dark:text-primary-a20 p-2 rounded-full shadow hover:bg-primary-a0/90 hover:text-white dark:hover:bg-primary-a20/90 transition-colors text-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                  type="button"
                  aria-label="Save article"
                  onClick={() => handleSave(article)}
                  disabled={saving === 'saving' || saving === 'saved'}
                  title={saving === 'saved' ? 'Saved' : 'Save article'}
                  tabIndex={0}
                >
                  <FaRegBookmark />
                  {saving === "saving" && <span className="ml-2 text-xs">Saving...</span>}
                  {saving === "saved" && <span className="ml-2 text-xs text-green-600">Saved!</span>}
                  {saving === "error" && <span className="ml-2 text-xs text-red-500">Error</span>}
                </button>
                <img
                  src={article.image_url || defaultImg}
                  alt="Article Thumbnail"
                  className="w-full h-48 sm:w-72 sm:h-72 flex-shrink-0 object-cover bg-gray-200 dark:bg-gray-700"
                  onError={e => { e.target.onerror = null; e.target.src = defaultImg; }}
                />
                <div className="p-6 flex flex-col justify-between relative min-h-[12rem] pb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                      {article.brief_des_batches}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {article.tags?.map((tag, i) => (
                        <span key={i} className="bg-lime-100 dark:bg-lime-700 text-lime-700 dark:text-lime-100 px-2 py-1 rounded text-xs">{tag}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {article.author} | {article.date_publish}
                    </p>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-primary-a0 dark:text-primary-a20 hover:underline cursor-pointer self-start"
                  >
                    Read more →
                  </a>
                  {/* Upvote/Downvote buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      className={`flex items-center px-2 py-1 rounded text-sm border ${vote === 1 ? 'bg-lime-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:bg-lime-600 disabled:opacity-60`}
                      onClick={() => handleVote(article, 1)}
                      disabled={voteLoading || vote === 1}
                      title="Upvote"
                    >
                      <FaThumbsUp className="mr-1" /> Upvote
                    </button>
                    <button
                      className={`flex items-center px-2 py-1 rounded text-sm border ${vote === -1 ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:bg-red-600 disabled:opacity-60`}
                      onClick={() => handleVote(article, -1)}
                      disabled={voteLoading || vote === -1}
                      title="Downvote"
                    >
                      <FaThumbsDown className="mr-1" /> Downvote
                    </button>
                    {voteLoading && <span className="ml-2 text-xs text-gray-500">Voting...</span>}
                    {voteError && <span className="ml-2 text-xs text-red-500">{voteError}</span>}
                  </div>
                </div>
                {/* Analysis button, only visible on hover */}
                <button
                  className="absolute bottom-4 right-4 px-4 py-2 bg-lime-500 text-white rounded-lg shadow-lg transition-opacity duration-200 hover:bg-lime-600 z-10 opacity-0 group-hover:opacity-100 pointer-events-auto"
                  onClick={() => handleAnalyze(article)}
                  title="Go to analysis page of this article"
                >
                  Go to analysis page
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
