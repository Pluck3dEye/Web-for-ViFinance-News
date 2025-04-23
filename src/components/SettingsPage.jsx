import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const settingsOptions = [
  "Profile Settings",
  "Security",
  "Notifications",
  "Privacy",
  "Billing",
  "Integrations",
  "Support"
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState(Array(settingsOptions.length).fill(false));
  const navigate = useNavigate();
  
  const toggleSwitch = (index) => {
    const updatedToggles = [...toggles];
    updatedToggles[index] = !updatedToggles[index];
    setToggles(updatedToggles);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-t from-lime-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Sidebar */}
      <div className="w-16 flex flex-col items-center space-y-4">
        <div className="text-3xl cursor-pointer text-lime-600 hover:text-lime-800 transition" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-6">
        
        {/* Action Button */}
        <div className="mb-6">
          <button className="bg-lime-500 hover:bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
            Settings
          </button>
        </div>

        {/* Settings List */}
        <div className="grid grid-cols-3 gap-4 items-center">
          {settingsOptions.map((option, index) => (
            <React.Fragment key={index}>
              {/* Option Title */}
              <div className="col-span-1 text-gray-700 dark:text-gray-200 font-medium">
                {option}
              </div>

              {/* Option Description */}
              <div className="col-span-1">
                <div className="bg-gray-200 dark:bg-gray-700 p-2 rounded-lg h-10 flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  Option description...
                </div>
              </div>

              {/* Toggle */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => toggleSwitch(index)}
                  className={`relative w-12 h-6 rounded-full transition ${
                    toggles[index] ? "bg-lime-500" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition ${
                      toggles[index] ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
