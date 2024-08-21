"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const VerifyEmail = () => {
  const [timer, setTimer] = useState(30);
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setEmail(searchParams.get("email") || "");
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer, searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      setVerificationCode(
        (prev) => prev.substring(0, index) + value + prev.substring(index + 1)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log(typeof email, typeof verificationCode);

    try {
      const response = await fetch(
        "https://akil-backend.onrender.com/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: verificationCode,
          }),
        }
      );
      console.log(response);
      if (!response.ok) {
        const result = await response.json();
        setError(result.message || "Verification failed. Please try again.");
        return;
      }

      if (response.ok) {
        alert(
          "Email verified successfully! You will be redirected to the login page."
        );

        router.push("./signin");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Verification failed", error);
    }
  };

  const resendCode = async () => {
    setError("");
    try {
      const response = await fetch(
        "https://akil-backend.onrender.com/resend-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        setError(result.message || "Failed to resend code. Please try again.");
        return;
      }

      setTimer(30); // Reset the timer after resending the code
      alert("Verification code resent successfully.");
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Resend code failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl text-center text-[#25324B] mb-6 font-[700]">
          Verify Email
        </h1>
        <p className="text-center text-gray-700 mb-4">
          We've sent a verification code to the email address you provided. To
          complete the verification process, please enter the code here.
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="text-black w-12 h-12 border-2 text-center text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8C6f6] border-[#C8C6f6]"
                value={verificationCode[index] || ""}
                onChange={(e) => handleInputChange(e, index)}
              />
            ))}
          </div>

          <div className="text-center text-gray-700 mb-6">
            <button
              type="button"
              onClick={resendCode}
              className="text-[#2D298E] disabled:opacity-50"
              disabled={timer > 0}
            >
              Resend code
            </button>{" "}
            in{" "}
            <span className="text-[#2D298E]">{`0:${
              timer < 10 ? `0${timer}` : timer
            }`}</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D298E] text-white py-2 rounded-3xl hover:bg-[#1f1aaa]"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;