export default function AnalysisPage() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-100 to-white dark:from-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-10">
            <Section title="Summary" text="This article summarizes the key points and findings related to the topic. It provides a comprehensive overview that captures the essential arguments and conclusions." />
            <Section title="Bias Analysis" text="The bias analysis discusses potential sources of bias in the data or methodology. It critically evaluates how these biases could affect the results and interpretations." />
            <Section title="Reliability Analysis" text="The reliability analysis examines the consistency and repeatability of the findings. It highlights methods used to ensure the credibility and trustworthiness of the data." />
            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-gray-600 dark:text-gray-300">Image or Graph Placeholder</span>
            </div>
          </div>
  
          {/* Right Column */}
          <div className="space-y-8">
            <Box title="Possible Tag">
              <div className="flex flex-wrap gap-2">
                <Tag text="Science" />
                <Tag text="Analysis" />
                <Tag text="Review" />
                <a href="#" className="text-lime-600 dark:text-lime-400 text-sm underline">
                  Learn more
                </a>
              </div>
            </Box>
            <Box title="General Result">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Overall, the findings support the hypothesis with minimal inconsistencies.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Further research is recommended to strengthen the conclusions drawn.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Limitations have been acknowledged and addressed appropriately.
              </p>
            </Box>
          </div>
        </div>
      </div>
    );
  }
  
  function Section({ title, text }) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-lime-600 dark:text-lime-400">{title}</h2>
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          {text}
        </p>
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