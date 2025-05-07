import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";

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
  const [analyzing, setAnalyzing] = useState(null); // url being analyzed
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
    fetch("http://localhost:7001/api/get_cached_result", {
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
    } catch (e) {
      setSynthError("Network error.");
    }
    setSynthLoading(false);
  };

  // Analysis click handler
  const handleAnalyze = async (article) => {
    setAnalyzing(article.url);
    console.log("Analyzing article:", article.url);
    try {
      // Helper to fetch and handle 404
      const safeFetch = async (url, body) => {
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          if (res.status === 404) return { _notFound: true };
          return await res.json();
        } catch {
          return { _notFound: true };
        }
      };

      // Run all 4 requests in parallel
      const [summaryRes, toxicityRes, sentimentRes, factcheckRes] = await Promise.all([
        safeFetch("http://localhost:7002/api/summarize/", { url: article.url }),
        safeFetch("http://localhost:7003/api/toxicity_analysis/", { url: article.url }),
        safeFetch("http://localhost:7003/api/sentiment_analysis/", { url: article.url }),
        safeFetch("http://localhost:7003/api/factcheck/", { url: article.url }),
      ]);

      const all404 = [summaryRes, toxicityRes, sentimentRes, factcheckRes].every(r => r._notFound);
      if (all404) {
        alert("All analysis services are unavailable. Please try again later.");
        setAnalyzing(null);
        return;
      }

      navigate("/analysis", {
        state: {
          article,
          summary: summaryRes._notFound ? "Not available" : summaryRes.summary,
          toxicity: toxicityRes._notFound ? null : JSON.stringify(toxicityRes.toxicity_analysis),
          sentiment: sentimentRes._notFound ? null : sentimentRes.sentiment_analysis,
          factcheck: factcheckRes._notFound ? "Not available" : factcheckRes["fact-check"]
        }
      });
    } catch (e) {
      alert("Failed to analyze article.");
    }
    setAnalyzing(null);
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
          {articles.map((article, idx) => (
            <div
              key={article.url || idx}
              className="relative flex flex-col sm:flex-row bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Save icon button, only visible on hover */}
              <button
                className="absolute top-3 right-3 bg-white/80 dark:bg-gray-700/80 text-primary-a0 dark:text-primary-a20 p-2 rounded-full shadow hover:bg-primary-a0/90 hover:text-white dark:hover:bg-primary-a20/90 transition-colors text-lg flex items-center justify-center border border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                type="button"
                aria-label="Save article"
              >
                <FaRegBookmark />
              </button>
              <img
                src={article.image_url}
                alt="Article Thumbnail"
                className="w-full sm:w-48 h-48 object-cover"
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
              </div>
              {/* Analysis button, only visible on hover */}
              <button
                className="absolute bottom-4 right-4 px-4 py-2 bg-lime-500 text-white rounded-lg shadow-lg transition-opacity duration-200 hover:bg-lime-600 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
                onClick={() => handleAnalyze(article)}
                disabled={analyzing === article.url}
                title="Go to analysis page of this article"
              >
                {analyzing === article.url ? "Analyzing..." : "Go to analysis page"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
