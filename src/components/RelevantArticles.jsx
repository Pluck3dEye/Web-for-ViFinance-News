import React from "react";

const articles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  title: "Article Title",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  image: "https://via.placeholder.com/150",
}));

export default function RelevantArticles() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-10 px-4 transition-colors duration-300">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-4">
        Relevant Articles
      </h1>
      <div className="w-20 h-1 bg-black dark:bg-white mx-auto mb-8 rounded"></div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl w-full max-w-3xl mx-auto p-6 mb-10">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec
          nisl odio.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Maecenas facilisis nisi vel nulla convallis, vel vehicula velit
          tincidunt.
        </p>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {articles.map((article) => (
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
    </div>
  );
}
