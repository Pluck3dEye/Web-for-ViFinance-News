import { useState } from "react";
// import OtpVerification from "./OtpVerification";

export default function AuthTabs({ onOtpRequired }) {
  const [activeTab, setActiveTab] = useState("login");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [registerSuccessMsg, setRegisterSuccessMsg] = useState("");

  return (
    <div className="flex flex-col justify-center items-center min-h-screen transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        {!forgotPassword ? (
          <>
            {/* Tab Navigation */}
            <div className="flex">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setRegisterSuccessMsg(""); // clear message when switching tab
                }}
                className={`w-1/2 py-3 text-center text-sm font-medium transition-colors duration-300 ${
                  activeTab === "login"
                    ? "bg-primary-a0 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab("register");
                  setRegisterSuccessMsg(""); // clear message when switching tab
                }}
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
                <>
                  {registerSuccessMsg && (
                    <div className="mb-4 text-green-600 text-center font-medium">
                      {registerSuccessMsg}
                    </div>
                  )}
                  <LoginForm
                    onSwitch={() => setActiveTab("register")}
                    onForgot={() => setForgotPassword(true)}
                    onOtpRequired={onOtpRequired}
                  />
                </>
              ) : (
                <RegisterForm
                  onSwitch={() => setActiveTab("login")}
                  onRegisterSuccess={() => {
                    setRegisterSuccessMsg(
                      "You registered a new account successfully. Please login in Login Tab."
                    );
                    setActiveTab("login");
                  }}
                />
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

function LoginForm({ onSwitch, onForgot, onOtpRequired }) {
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          login: loginName, // can be username or email
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // If backend says OTP required, call onOtpRequired
        if (data.otp_required) {
          onOtpRequired();
        } else {
          // fallback: login success
        }
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label htmlFor="loginName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email or username</label>
        <input
          type="text"
          id="loginName"
          value={loginName}
          onChange={e => setLoginName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
        <input
          type="password"
          id="loginPassword"
          value={loginPassword}
          onChange={e => setLoginPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="text-right">
        <button type="button" onClick={onForgot} className="text-sm text-primary-a0 dark:text-primary-a30 hover:underline">
          Forgot password?
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Not a member? <button type="button" onClick={onSwitch} className="text-primary-a0 dark:text-primary-a30 hover:underline">Register</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch, onRegisterSuccess }) {
  const [registerName, setRegisterName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerRepeatPassword, setRegisterRepeatPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (registerPassword !== registerRepeatPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!agree) {
      setError("You must agree to the terms");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: registerName,
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Show success message and switch to login tab
        if (onRegisterSuccess) onRegisterSuccess();
      } else {
        setError(data?.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      <div>
        <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
        <input
          type="text"
          id="registerName"
          value={registerName}
          onChange={e => setRegisterName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="registerUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Username</label>
        <input
          type="text"
          id="registerUsername"
          value={registerUsername}
          onChange={e => setRegisterUsername(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
        <input
          type="email"
          id="registerEmail"
          value={registerEmail}
          onChange={e => setRegisterEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Password</label>
        <input
          type="password"
          id="registerPassword"
          value={registerPassword}
          onChange={e => setRegisterPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="registerRepeatPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Repeat password</label>
        <input
          type="password"
          id="registerRepeatPassword"
          value={registerRepeatPassword}
          onChange={e => setRegisterRepeatPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-a10 focus:border-primary-a10 dark:text-white"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="registerCheck"
          checked={agree}
          onChange={e => setAgree(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="registerCheck" className="text-sm text-gray-700 dark:text-gray-300">I have read and agree to the terms</label>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>
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
