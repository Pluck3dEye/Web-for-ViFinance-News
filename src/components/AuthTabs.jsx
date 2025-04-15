import { useState } from "react";
import OtpVerification from "./OtpVerification";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        {showOtp ? (
          <div className="p-6">
            <OtpVerification onBack={() => setShowOtp(false)} />
          </div>
        ) : !forgotPassword ? (
          <>
            {/* Tab Navigation */}
            <div className="flex">
              <button
                onClick={() => setActiveTab("login")}
                className={`w-1/2 py-3 text-center text-sm font-medium transition-colors duration-300 ${
                  activeTab === "login"
                    ? "bg-primary-a0 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`w-1/2 py-3 text-center text-sm font-medium transition-colors duration-300 ${
                  activeTab === "register"
                    ? "bg-primary-a0 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Register
              </button>
            </div>

            <div className="p-6">
              {activeTab === "login" ? (
                <LoginForm
                  onSwitch={() => setActiveTab("register")}
                  onForgot={() => setForgotPassword(true)}
                  onSuccess={() => setShowOtp(true)}
                />
              ) : (
                <RegisterForm onSwitch={() => setActiveTab("login")} />
              )}
            </div>
          </>
        ) : (
          <div className="p-6">
            <ForgotPasswordForm onBack={() => setForgotPassword(false)} />
          </div>
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSwitch, onForgot, onSuccess }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login and trigger OTP view
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="loginName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email or username</label>
        <input type="email" id="loginName" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <div>
        <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
        <input type="password" id="loginPassword" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <div className="text-right">
        <button type="button" onClick={onForgot} className="text-sm text-primary-a0 dark:text-primary-a30 hover:underline">
          Forgot password?
        </button>
      </div>

      <button type="submit" className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition">Sign in</button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Not a member? <button type="button" onClick={onSwitch} className="text-primary-a0 dark:text-primary-a30 hover:underline">Register</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
        <input type="text" id="registerName" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <div>
        <label htmlFor="registerUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
        <input type="text" id="registerUsername" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <div>
        <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
        <input type="email" id="registerEmail" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <div>
        <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
        <input type="password" id="registerPassword" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <div>
        <label htmlFor="registerRepeatPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Repeat password</label>
        <input type="password" id="registerRepeatPassword" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <div className="flex items-center">
        <input type="checkbox" id="registerCheck" defaultChecked className="mr-2" />
        <label htmlFor="registerCheck" className="text-sm text-gray-700 dark:text-gray-300">I have read and agree to the terms</label>
      </div>

      <button type="submit" className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition">Sign up</button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already a member? <button type="button" onClick={onSwitch} className="text-primary-a0 dark:text-primary-a10 hover:underline">Login</button>
      </p>
    </form>
  );
}

function ForgotPasswordForm({ onBack }) {
  return (
    <form className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Forgot your password?</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">Enter your email address and we'll send you instructions to reset your password.</p>

      <div>
        <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email address</label>
        <input type="email" id="forgotEmail" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white" />
      </div>

      <button type="submit" className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition">Send Reset Link</button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Remembered your password? <button type="button" onClick={onBack} className="text-primary-a0 dark:text-primary-a10 hover:underline">Back to login</button>
      </p>
    </form>
  );
}
