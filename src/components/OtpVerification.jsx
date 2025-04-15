import { useState, useRef } from "react";

export default function OtpVerification({ onBack }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join("");
    console.log("Submitted OTP:", code);
    // Add validation or API call here
  };

  return (
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
          />
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-primary-a0 text-white py-2 rounded-md hover:bg-primary-a10 transition"
      >
        Verify
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Didn’t receive a code?{" "}
          <button
            type="button"
            className="text-primary-a0 dark:text-primary-a10 hover:underline"
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
  );
}
