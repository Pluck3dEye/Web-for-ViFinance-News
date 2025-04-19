import React from "react";

const contentData = [
  {
    title: "Who We Are",
    description:
      "We are a passionate team of creators and innovators working to bring high-quality digital products to life. Our mission is to empower people through technology.",
    image: "https://placehold.co/300x300.jpg",
  },
  {
    title: "Our Mission",
    description:
      "To deliver exceptional service and products that enrich our users’ lives while continuously learning and growing as a company.",
    image: "https://placehold.co/300x300.jpg",
  },
  {
    title: "What Drives Us",
    description:
      "Curiosity, creativity, and community are the core of what keeps us moving forward. We are inspired by challenges and motivated by change.",
    image: "https://placehold.co/300x300.jpg",
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold border-b-4 border-lime-500 inline-block mb-12">
          About Us
        </h1>

        <div className="space-y-12">
          {contentData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-6 md:items-start"
            >
              {/* Image */}
              <div className="bg-lime-100 dark:bg-lime-800 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-fit h-fit object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 border-l-2 border-gray-300 dark:border-gray-700 pl-6">
                <h2 className="text-xl font-semibold mb-2 text-lime-600 dark:text-lime-400">
                  {item.title}
                </h2>
                <p className="text-base leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;