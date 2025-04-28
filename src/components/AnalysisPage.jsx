import { useLocation } from "react-router-dom";

export default function AnalysisPage() {
  const location = useLocation();
  const { article, summary, toxicity, sentiment, factcheck } = location.state || {};

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700 dark:text-gray-200">
        No analysis data. Please select an article from Relevant Articles.
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
            {toxicity ? (
              <ul className="space-y-2">
                {Object.entries(toxicity).map(([label, value]) => (
                  <li key={label} className="flex justify-between">
                    <span className="font-medium">{translateToxicity(label)}:</span>
                    <span>{(value * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
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
          <Section title="Fact Check">
            {factcheck || "No fact-check result."}
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
      {text ? <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{text}</p> : children}
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