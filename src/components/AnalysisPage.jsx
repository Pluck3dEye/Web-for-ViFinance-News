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

    // Sequentially run all 5 requests, with 15s delay between each
    const runSequentialAnalysis = async () => {
      // 1. Summary
      const summaryRes = await safeFetch(`${API_BASES.summariser}/api/summarize/`, { url: article.url });
      setSummary(summaryRes._notFound ? null : summaryRes.summary);
      await new Promise(r => setTimeout(r, 15000));

      // 2. Toxicity
      const toxicityRes = await safeFetch(`${API_BASES.analysis}/api/toxicity_analysis/`, { url: article.url });
      setToxicity(toxicityRes._notFound ? null : toxicityRes.toxicity_analysis);
      await new Promise(r => setTimeout(r, 15000));

      // 3. Sentiment
      const sentimentRes = await safeFetch(`${API_BASES.analysis}/api/sentiment_analysis/`, { url: article.url });
      setSentiment(sentimentRes._notFound ? null : sentimentRes.sentiment_analysis);
      await new Promise(r => setTimeout(r, 15000));

      // 4. Factcheck
      const factcheckRes = await safeFetch(`${API_BASES.analysis}/api/factcheck/`, { url: article.url });
      let factObj = null;
      let factRefs = null;
      if (factcheckRes && factcheckRes["fact-check"]) {
        if (typeof factcheckRes["fact-check"] === "object") {
          factObj = factcheckRes["fact-check"];
          if (factObj["Danh sách các dẫn chứng"]) {
            factRefs = factObj["Danh sách các dẫn chứng"];
          }
        }
      }
      setFactcheck(factObj);
      setFactReferences(factRefs);
      await new Promise(r => setTimeout(r, 15000));

      // 5. Bias
      const biasRes = await safeFetch(`${API_BASES.analysis}/api/biascheck/`, { url: article.url });
      let biasObj = null;
      if (biasRes && biasRes.data && biasRes.data["bias-check"]) {
        biasObj = biasRes.data["bias-check"];
      } else if (biasRes && biasRes["bias-check"]) {
        biasObj = biasRes["bias-check"];
      } else if (biasRes && biasRes.message) {
        biasObj = { message: biasRes.message };
      }
      setBias(biasObj);

      // If all failed
      if ([summaryRes, toxicityRes, sentimentRes, factcheckRes, biasRes].every(r => r._notFound)) {
        setError("All analysis services are unavailable. Please try again later.");
      }
      setLoading(false);
    };

    runSequentialAnalysis();
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

  // Helper for Vietnamese sentiment translation and color
  function getSentimentInfo(label) {
    switch (label) {
      case "Very Negative":
        return { vi: "Rất tiêu cực", color: "text-red-600 dark:text-red-400" };
      case "Negative":
        return { vi: "Tiêu cực", color: "text-orange-500 dark:text-orange-400" };
      case "Neutral":
        return { vi: "Trung lập", color: "text-yellow-500 dark:text-yellow-300" };
      case "Positive":
        return { vi: "Tích cực", color: "text-lime-600 dark:text-lime-400" };
      case "Very Positive":
        return { vi: "Rất tích cực", color: "text-green-600 dark:text-green-400" };
      default:
        return { vi: label, color: "" };
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 dark:text-gray-200">
        No analysis data. Please select an article from Relevant Articles.
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
          <Section title="Summary" text={
            summary === null
              ? <span className="text-gray-400">Getting result...</span>
              : summary || <span className="text-gray-400">No summary available.</span>
          } />
          <Section title="Toxicity Analysis">
            {toxicity === null ? (
              <span className="text-gray-400">Getting result...</span>
            ) : parsedToxicity && typeof parsedToxicity === "object" ? (
              <ul className="space-y-2">
                {Object.entries(parsedToxicity).map(([label, value]) => (
                  <li key={label} className="flex justify-between">
                    <span className="font-medium text-primary-a0 dark:text-primary-a20">{label}:</span>
                    <span>{(value * 100).toFixed(2)}%</span>
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
            {sentiment === null ? (
              <span className="text-gray-400">Getting result...</span>
            ) : sentiment ? (
              <div>
                <div className="font-medium text-primary-a0 dark:text-primary-a20">
                  Mức độ cảm xúc:{" "}
                  <span className={getSentimentInfo(sentiment.sentiment_label).color}>
                    {getSentimentInfo(sentiment.sentiment_label).vi}
                  </span>
                </div>
                <div>Độ tin cậy: {(sentiment.sentiment_score * 100).toFixed(2)}%</div>
              </div>
            ) : (
              <span>No sentiment analysis available.</span>
            )}
          </Section>
          <Section title="Bias Check">
            {bias === null ? (
              <span className="text-gray-400">Getting result...</span>
            ) : bias ? (
              bias["Loại thiên kiến"] || bias["bias_type"] ? (
                <div>
                  <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Loại thiên kiến:</span> {bias["Loại thiên kiến"] || bias["bias_type"]}</div>
                  <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Mức độ ảnh hưởng:</span> {bias["Mức độ ảnh hưởng"] || bias["impact_level"]}</div>
                  <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Phân tích ngắn gọn:</span> {bias["Phân tích ngắn gọn"] || bias["analysis"]}</div>
                  {Array.isArray(bias["Câu hỏi phản biện"] || bias["socratic_questions"]) && (
                    <div className="mt-2">
                      <div className="font-medium mb-1 text-primary-a0 dark:text-primary-a20">Câu hỏi phản biện:</div>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {(bias["Câu hỏi phản biện"] || bias["socratic_questions"]).map((q, i) => (
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
            {factcheck === null ? (
              <span className="text-gray-400">Getting result...</span>
            ) : factcheck && typeof factcheck === "object" && factcheck["Kết luận"] ? (
              <div>
                <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Kết luận:</span> <span dangerouslySetInnerHTML={{__html: linkifyReferences(factcheck["Kết luận"], factReferences)}} /></div>
                <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Phân tích bằng chứng:</span> <span dangerouslySetInnerHTML={{__html: linkifyReferences(factcheck["Phân tích bằng chứng"], factReferences)}} /></div>
                <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Mức độ tin cậy:</span> {factcheck["Mức độ tin cậy"]}</div>
                <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Giải thích:</span> <span dangerouslySetInnerHTML={{__html: linkifyReferences(factcheck["Giải thích"], factReferences)}} /></div>
                <div className="mb-2"><span className="font-medium text-primary-a0 dark:text-primary-a20">Lời khuyên cho người dùng về cách nhìn nhận hiện tại:</span> <span dangerouslySetInnerHTML={{__html: linkifyReferences(factcheck["Lời khuyên cho người dùng về cách nhìn nhận hiện tại"], factReferences)}} /></div>
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

// Helper to hyperlink [1], [2], ... in text using references
function linkifyReferences(text, references) {
  if (!references || typeof text !== 'string') return text;
  const refKeys = Object.keys(references);
  if (refKeys.length === 0) return text;
  // Build a regex to match [1], [2], ...
  // Escape numbers only, e.g. [1], [2], ...
  const numbers = refKeys.map(k => k.replace(/\[|\]/g, ''));
  const refPattern = new RegExp(`\\[(${numbers.join('|')})\\]`, 'g');
  return text.replace(refPattern, (match, p1) => {
    const key = `[${p1}]`;
    const ref = references[key];
    if (ref && ref.url) {
      return `<a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="text-primary-a0 dark:text-primary-a20 underline">${key}</a>`;
    }
    return match;
  });
}