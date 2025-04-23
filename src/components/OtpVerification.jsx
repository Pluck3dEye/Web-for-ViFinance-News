import { useState, useRef } from "react";

export default function OtpVerification({ onBack, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp: code }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        if (onSuccess) onSuccess(data); // Pass user data to parent
      } else {
        setError(data?.message || "Invalid OTP");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to resend OTP");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
            Enter the 6-digit code sent to your email
          </h2>

          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 text-center text-lg border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={success}
              />
            ))}
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">OTP Verified!</div>}

          <button
            type="submit"
            className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition"
            disabled={loading || success}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn’t receive a code?{" "}
              <button
                type="button"
                className="text-primary-a0 dark:text-primary-a10 hover:underline"
                onClick={handleResend}
              >
                Resend
              </button>
            </p>

            <button
              type="button"
              onClick={onBack}
              className="mt-4 text-sm text-gray-500 dark:text-gray-300 hover:underline"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
