import { useState, useRef } from "react";
import { API_BASES } from "../config";

export default function OtpVerification({ onBack, onSuccess, email, cardClassName = "" }) {
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
    if (!email) {
      setError("Missing email for OTP verification.");
      setLoading(false);
      return;
    }
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASES.auth}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        if (onSuccess) onSuccess(data.userId || (data.user && data.user.userId));
      } else {
        setError(data?.error || data?.message || "Invalid OTP");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[300px]">
      <div
        className={`rounded-xl p-6 ${cardClassName} mx-2 sm:mx-auto`}
        style={{ minWidth: 0 }}
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-lime-600 dark:text-lime-400 text-center mb-2">
            OTP Verification
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-2">
            Enter the 6-digit code sent to your email
          </p>
          <div className="flex justify-center gap-3 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-mono border-2 border-lime-300 dark:border-lime-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                disabled={success}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">OTP Verified!</div>}

          <button
            type="submit"
            className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-600 transition font-semibold text-lg shadow"
            disabled={loading || success}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn’t receive a code?{" "}
              <button
                type="button"
                className="text-primary-a0 dark:text-primary-a10 hover:underline"
                onClick={() => setError("Resend functionality is not implemented.")}
              >
                Resend
              </button>
            </p>
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-gray-500 dark:text-gray-300 hover:underline"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
