import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_BASES } from "../config";

export default function AnalysisPage() {
  const location = useLocation();
  let { article } = location.state || {};
  const [summary, setSummary] = useState(null);
  const [toxicity, setToxicity] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [factcheck, setFactcheck] = useState(null);
  const [bias, setBias] = useState(null);
  const [factReferences, setFactReferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!article?.url) return;
    setLoading(true);
    setError("");

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

    // Run all 5 requests in parallel
    Promise.all([
      safeFetch(`${API_BASES.summariser}/summarize/`, { url: article.url }),
      safeFetch(`${API_BASES.analysis}/toxicity_analysis/`, { url: article.url }),
      safeFetch(`${API_BASES.analysis}/sentiment_analysis/`, { url: article.url }),
      safeFetch(`${API_BASES.analysis}/api/factcheck/`, { url: article.url }),
      safeFetch(`${API_BASES.analysis}/api/biascheck/`, { url: article.url })
    ]).then(([summaryRes, toxicityRes, sentimentRes, factcheckRes, biasRes]) => {
      if ([summaryRes, toxicityRes, sentimentRes, factcheckRes, biasRes].every(r => r._notFound)) {
        setError("All analysis services are unavailable. Please try again later.");
        setLoading(false);
        return;
      }
      setSummary(summaryRes._notFound ? null : summaryRes.summary);
      setToxicity(toxicityRes._notFound ? null : toxicityRes.toxicity_analysis);
      setSentiment(sentimentRes._notFound ? null : sentimentRes.sentiment_analysis);
      setFactcheck(factcheckRes._notFound ? null : factcheckRes);
      setBias(biasRes._notFound ? null : biasRes);
      if (factcheckRes && factcheckRes["Danh sách các dẫn chứng"]) {
        setFactReferences(factcheckRes["Danh sách các dẫn chứng"]);
      }
      setLoading(false);
    });
  }, [article?.url]);

  // Parse toxicity if it's a JSON string
  let parsedToxicity = toxicity;
  if (typeof toxicity === "string") {
    try {
      parsedToxicity = JSON.parse(toxicity);
    } catch {
      // If parsing fails, leave as is
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 dark:text-gray-200">
        No analysis data. Please select an article from Relevant Articles.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 dark:text-gray-200">
        Loading analysis...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 to-white dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-10">
          <Section title="Summary" text={summary || "No summary available."} />
          <Section title="Toxicity Analysis">
            {parsedToxicity && typeof parsedToxicity === "object" ? (
              <ul className="space-y-2">
                {Object.entries(parsedToxicity).map(([label, value]) => (
                  <li key={label} className="flex justify-between">
                    <span className="font-medium">{translateToxicity(label)}:</span>
                    <span>{(value * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            ) : toxicity === "Not available" ? (
              <span>Not available.</span>
            ) : (
              <span>No toxicity analysis available.</span>
            )}
          </Section>
          <Section title="Sentiment Analysis">
            {sentiment ? (
              <div>
                <div className="font-medium">Label: <span className="text-lime-600 dark:text-lime-400">{sentiment.sentiment_label}</span></div>
                <div>Confidence: {(sentiment.sentiment_score * 100).toFixed(1)}%</div>
              </div>
            ) : (
              <span>No sentiment analysis available.</span>
            )}
          </Section>
          <Section title="Bias Check">
            {bias ? (
              bias["Loại thiên kiến"] ? (
                <div>
                  <div className="mb-2"><span className="font-medium">Type:</span> {bias["Loại thiên kiến"]}</div>
                  <div className="mb-2"><span className="font-medium">Impact Level:</span> {bias["Mức độ ảnh hưởng"]}</div>
                  <div className="mb-2"><span className="font-medium">Analysis:</span> {bias["Phân tích ngắn gọn"]}</div>
                  {Array.isArray(bias["Câu hỏi phản biện"]) && (
                    <div className="mt-2">
                      <div className="font-medium mb-1">Critical Questions:</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {bias["Câu hỏi phản biện"].map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : bias["message"] ? (
                <span>{bias["message"]}</span>
              ) : (
                <span>No bias detected.</span>
              )
            ) : (
              <span>Loading bias check...</span>
            )}
          </Section>
          <Section title="Fact Check">
            {factcheck && typeof factcheck === "object" && factcheck["Kết luận"] ? (
              <div>
                <div className="mb-2"><span className="font-medium">Conclusion:</span> {factcheck["Kết luận"]}</div>
                <div className="mb-2"><span className="font-medium">Evidence Analysis:</span> {factcheck["Phân tích bằng chứng"]}</div>
                <div className="mb-2"><span className="font-medium">Reliability:</span> {factcheck["Mức độ tin cậy"]}</div>
                <div className="mb-2"><span className="font-medium">Explanation:</span> {factcheck["Giải thích"]}</div>
                <div className="mb-2"><span className="font-medium">Advice:</span> {factcheck["Lời khuyên cho người dùng về cách nhìn nhận hiện tại"]}</div>
                {factReferences && (
                  <div className="mt-4">
                    <div className="font-medium mb-2">References:</div>
                    <ol className="list-decimal list-inside space-y-2">
                      {Object.entries(factReferences).map(([refKey, ref]) => (
                        <li key={refKey} className="text-sm">
                          <span className="font-semibold">{refKey.replace(/\[|\]/g, "")}.</span>{" "}
                          <span className="italic">{ref.title}</span>.{" "}
                          <span>{ref.publisher}.</span>{" "}
                          <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary-a0 dark:text-primary-a20 underline">
                            [Link]
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ) : factcheck && factcheck["message"] ? (
              <span>{factcheck["message"]}</span>
            ) : (
              <span>No fact-check result.</span>
            )}
          </Section>
          <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-gray-600 dark:text-gray-300">Image or Graph Placeholder</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <Box title="Article Info">
            <div className="mb-2 font-semibold">{article.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">{article.author} | {article.date_publish}</div>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-primary-a0 dark:text-primary-a20 underline">View Original</a>
          </Box>
          <Box title="Tags">
            <div className="flex flex-wrap gap-2">
              {article.tags?.map((tag, i) => (
                <Tag key={i} text={tag} />
              ))}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

function Section({ title, text, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-lime-600 dark:text-lime-400">{title}</h2>
      {children !== undefined
        ? children
        : <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{text}</p>}
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-lime-600 dark:text-lime-400">{title}</h3>
      {children}
    </div>
  );
}

function Tag({ text }) {
  return (
    <span className="px-4 py-1 bg-lime-400 dark:bg-lime-600 text-gray-900 dark:text-gray-100 rounded-full text-xs font-semibold shadow">
      {text}
    </span>
  );
}

function translateToxicity(label) {
  // Vietnamese to English mapping
  const map = {
    "Công kích danh tính": "Identity Attack",
    "Mức Độ Thô Tục": "Profanity",
    "Tính Xúc Phạm": "Insult",
    "Tính Đe Doạ": "Threat",
    "Tính Độc Hại": "Toxicity"
  };
  return map[label] || label;
}