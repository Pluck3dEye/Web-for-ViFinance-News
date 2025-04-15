import React from "react";
import {
  FaArrowLeft,
  FaUserCircle,
  FaChartPie,
  FaEllipsisH
} from "react-icons/fa";

export default function UserProfilePage() {

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 p-6 font-sans text-gray-800 dark:text-gray-100 transition-colors">
        <div className="flex justify-start items-center mb-6">
          <div className="text-3xl cursor-pointer text-orange-600 hover:text-orange-800">
            <FaArrowLeft />
          </div>
        </div>

        {/* Filter section */}
        <div className="flex flex-wrap gap-4 mb-8">
          {["Filter 1", "Filter 2", "Filter 3", "Filter 4", "Filter 5"].map((filter, i) => (
            <div key={i} className="bg-white dark:bg-gray-700 shadow px-4 py-2 rounded-lg min-w-[100px] text-center">
              {filter}
            </div>
          ))}
          <div className="bg-white dark:bg-gray-700 shadow px-4 py-2 rounded-lg min-w-[100px] text-center">Dropdown</div>
        </div>

        {/* Profile and Summary Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Profile Card */}
          <div className="w-full lg:w-[280px] bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 text-center">
            <FaUserCircle className="text-6xl text-orange-400 dark:text-orange-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">John Doe</h2>
            <p className="text-gray-500 dark:text-gray-300 mb-4">Premium User</p>
            <div className="space-y-3">
              <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">Edit Profile</button>
              <button className="w-full bg-orange-300 text-white py-2 rounded-lg hover:bg-orange-400 transition">Settings</button>
            </div>
          </div>

          {/* Summary Box */}
          <div className="flex-1 bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6">
            <div className="flex justify-end mb-4">
              <FaEllipsisH className="text-gray-400 dark:text-gray-300 cursor-pointer" />
            </div>
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Email: a@a</li>
              <li>Active Plans: 3</li>
              <li>Last Login: April 13, 2025</li>
              <li>Region: US-East</li>
            </ul>
          </div>
        </div>

        {/* Analysis Section */}
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Insights & Analysis</h2>
        <div className="flex gap-4 bg-white dark:bg-gray-700 shadow p-4 rounded-xl mb-8 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          <div className="cursor-pointer hover:text-orange-600 dark:hover:text-orange-400">Overview</div>
          <div className="cursor-pointer hover:text-orange-600 dark:hover:text-orange-400">Spending</div>
          <div className="cursor-pointer hover:text-orange-600 dark:hover:text-orange-400">Saved</div>
        </div>

        {/* Bubble Icons */}
        <div className="flex justify-between md:justify-around mb-12">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-gradient-to-br from-orange-300 to-yellow-300 dark:from-orange-500 dark:to-yellow-400 rounded-full shadow-md" />
          ))}
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Pie Chart Card */}
          <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Spending Breakdown</h4>
              <FaChartPie className="text-gray-500 dark:text-gray-300" />
            </div>
            <div className="w-[180px] h-[180px] bg-gradient-to-tr from-orange-200 to-yellow-200 dark:from-orange-400 dark:to-yellow-400 rounded-full mx-auto" />
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Last updated: Today</p>
          </div>

          {/* Data Overview */}
          <div className="bg-white dark:bg-gray-700 shadow-xl rounded-2xl p-6">
            <h4 className="font-semibold mb-3">Recent Activity</h4>
            {["Logged in", "Updated profile", "Made a payment", "Changed plan", "Checked report"].map((event, i) => (
              <p key={i} className="text-sm text-gray-600 dark:text-gray-300 mb-1">{event}</p>
            ))}
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-3">
          {["Billing Details", "Security Settings", "Connected Apps", "Support Tickets"].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-700 shadow rounded-xl p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
            >
              <span>{item}</span>
              <span className="text-lg font-bold text-gray-500 dark:text-gray-300">+</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
