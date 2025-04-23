import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './authContext';

import RelevantArticles from './components/RelevantArticles.jsx';
import AuthTabs from './components/AuthTabs.jsx';
import UserProfilePage from './components/UserProfilePage.jsx';
import AnalysisPage from './components/AnalysisPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import AboutUs from './components/AboutUs.jsx';
import MainHeader from './components/MainHeader.jsx';
import OtpVerification from './components/OtpVerification.jsx';
import ProfileEditor from './components/ProfileEditor.jsx';
import LoadingLayout from './layouts/LoadingLayout.jsx';
import SavedArticles from './components/SavedArticles.jsx';

function App() {
  const { user, loading, login } = useAuth();
  const [otpRequired, setOtpRequired] = useState(false);
  const navigate = useNavigate();

  const handleOtpSuccess = (userData) => {
    login(userData); // set user in context
    setOtpRequired(false);
    navigate("/"); // redirect to home
  };

  if (loading) {
    return (
      // Loading spinner
      <LoadingLayout />
    );
  }

  return (
    <Routes>
      {/* Shared layout for most routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<MainHeader />} />
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" />
              : otpRequired
                ? <OtpVerification onBack={() => setOtpRequired(false)} onSuccess={handleOtpSuccess} />
                : <AuthTabs onOtpRequired={() => setOtpRequired(true)} />
          }
        />
        <Route path="/profile-edit" element={<ProfileEditor />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/profile" element={user ? <UserProfilePage /> : <Navigate to="/" />} />
        <Route path="/analysis" element={user ? <AnalysisPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/" />} />
        <Route path="/relevant-articles" element={<RelevantArticles />} />
        <Route path="/saved-articles" element={user ? <SavedArticles /> : <Navigate to="/login" />} />
      </Route>

      {/* Optional: route without layout */}
      {/* <Route path="/admin" element={<AdminDashboard />} /> */}
    </Routes>
  );
}

export default App;
