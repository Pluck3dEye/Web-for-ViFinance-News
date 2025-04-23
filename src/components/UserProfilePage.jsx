import React, { useState } from "react";
import {
  FaArrowLeft,
  FaUserCircle,
  FaChartPie,
  FaEllipsisH
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Tab content map
  const tabContent = {
    overview: (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Spending Breakdown</h4>
              <FaChartPie className="text-gray-500 dark:text-gray-300" />
            </div>
            <div className="w-[180px] h-[180px] bg-gradient-to-tr from-lime-200 to-lime-300 dark:from-lime-400 dark:to-lime-500 rounded-full mx-auto" />
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Last updated: Today</p>
          </div>
          <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6">
            <h4 className="font-semibold mb-3">Recent Activity</h4>
            {["Logged in", "Updated profile", "Made a payment", "Changed plan", "Checked report"].map((event, i) => (
              <p key={i} className="text-sm text-gray-600 dark:text-gray-300 mb-1">{event}</p>
            ))}
          </div>
        </div>
      </div>
    ),
    spending: (
      <div>
        <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6 mb-6">
          <h4 className="font-semibold mb-3">Spending Analysis</h4>
          <div className="w-[180px] h-[180px] bg-gradient-to-tr from-lime-200 to-lime-300 dark:from-lime-400 dark:to-lime-500 rounded-full mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-center">Your spending breakdown and trends will appear here.</p>
        </div>
        <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6">
          <h4 className="font-semibold mb-3">Top Categories</h4>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
            <li>Food & Dining</li>
            <li>Shopping</li>
            <li>Utilities</li>
            <li>Travel</li>
          </ul>
        </div>
      </div>
    ),
    saved: (
      <div>
        <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6 mb-6">
          <h4 className="font-semibold mb-3">Saved Reports</h4>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
            <li>Monthly Spending Report - March 2025</li>
            <li>Annual Summary 2024</li>
            <li>Custom Export - Q1 2025</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6">
          <h4 className="font-semibold mb-3">Notes</h4>
          <p className="text-gray-600 dark:text-gray-300">You can save your favorite reports and notes here for quick access.</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen bg-gradient-to-t from-lime-50 to-lime-white dark:from-gray-950 dark:to-gray-900 p-6 font-sans text-gray-800 dark:text-gray-100 transition-colors">
        <div className="flex justify-start items-center mb-6">
          <div className="text-3xl cursor-pointer text-lime-600 hover:text-lime-800 transition" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </div>
        </div>

        {/* Profile and Summary Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Profile Card */}
          <div className="w-full lg:w-[280px] bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 text-center">
            <FaUserCircle className="text-6xl text-lime-400 dark:text-lime-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{user?.name || user?.username || "User"}</h2>
            <p className="text-gray-500 dark:text-gray-300 mb-1 break-all">{user?.email}</p>
            <p className="text-gray-400 dark:text-gray-400 mb-4">{user?.username ? `@${user.username}` : ""}</p>
            <div className="space-y-3">
              <button
                className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600 transition"
                onClick={() => navigate("/profile-edit")}
              >
                Edit Profile
              </button>
              <button
                className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600 transition"
                onClick={() => navigate("/settings")}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Summary Box */}
          <div className="flex-1 bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6">
            <div className="flex justify-end mb-4">
              <FaEllipsisH className="text-gray-400 dark:text-gray-300 cursor-pointer" />
            </div>
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>
                <span className="font-medium">Name:</span> {user?.name || "-"}
              </li>
              <li>
                <span className="font-medium">Username:</span> {user?.username || "-"}
              </li>
              <li>
                <span className="font-medium">Email:</span> {user?.email || "-"}
              </li>
              {/* Add more user info fields here if available */}
              <li>
                <span className="font-medium">Status:</span> Active
              </li>
              <li>
                <span className="font-medium">Plan:</span> Premium
              </li>
            </ul>
          </div>
        </div>

        {/* Insights & Analysis Tabs */}
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Insights & Analysis</h2>
        <div className="flex gap-4 bg-white dark:bg-gray-700 shadow p-4 rounded-xl mb-8 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          <button
            className={`flex-1 py-2 rounded transition ${
              activeTab === "overview"
                ? "bg-lime-500 text-white font-bold shadow"
                : "hover:text-lime-600 dark:hover:text-lime-400"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`flex-1 py-2 rounded transition ${
              activeTab === "spending"
                ? "bg-lime-500 text-white font-bold shadow"
                : "hover:text-lime-600 dark:hover:text-lime-400"
            }`}
            onClick={() => setActiveTab("spending")}
          >
            Spending
          </button>
          <button
            className={`flex-1 py-2 rounded transition ${
              activeTab === "saved"
                ? "bg-lime-500 text-white font-bold shadow"
                : "hover:text-lime-600 dark:hover:text-lime-400"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {tabContent[activeTab]}
        </div>
      </div>
    </div>
  );
}
