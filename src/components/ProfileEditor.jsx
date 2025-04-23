import React, { useState } from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";

export default function ProfileEditor() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Handle avatar preview and upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setAvatarPreview(reader.result);
        // Upload avatar to backend
        try {
          const res = await fetch("http://localhost:5000/api/avatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ avatar: reader.result }),
          });
          if (res.ok) {
            updateUser({ avatar: reader.result });
            setMessage("Avatar updated!");
          } else {
            setError("Failed to update avatar");
          }
        } catch {
          setError("Network error");
        }
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  // Profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully!");
        updateUser({ name: data.name, email: data.email });
      } else {
        setError(data?.message || "Failed to update profile");
      }
    } catch {
      setError("Network error");
    }
  };

  // Password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!currentPassword || !newPassword || !repeatPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (newPassword !== repeatPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setRepeatPassword("");
      } else {
        setError(data?.message || "Failed to change password");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/api/delete-account", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        logout();
        setDeleting(false);
        navigate("/");
      } else {
        setError("Failed to delete account");
        setDeleting(false);
      }
    } catch {
      setError("Network error");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-t from-lime-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-lime-600 dark:text-lime-400">Edit Profile</h2>
        {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-lime-300 to-lime-500 dark:from-lime-700 dark:to-lime-400 border-4 border-primary-a0 dark:border-lime-500 shadow-lg flex items-center justify-center overflow-hidden transition-all duration-300">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl text-lime-600 dark:text-lime-300">👤</span>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
                title="Change avatar"
              >
                <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold transition-opacity duration-200">
                  Change Avatar
                </span>
                <svg className="w-6 h-6 mt-1 opacity-0 group-hover:opacity-100 text-white transition-opacity duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6" />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">Click avatar to choose a new image</span>
        </div>

        {/* Profile Info */}
        <form onSubmit={handleProfileUpdate} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition"
          >
            Save Changes
          </button>
        </form>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Change Password</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Repeat New Password</label>
            <input
              type="password"
              value={repeatPassword}
              onChange={e => setRepeatPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-lime-500 text-white py-2 rounded-md hover:bg-lime-600 transition"
          >
            Change Password
          </button>
        </form>

        {/* Delete Account */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded-md transition"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
