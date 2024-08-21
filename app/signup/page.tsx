"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://akil-backend.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          role: "user",
        }),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg relative">
        <h1 className="text-2xl text-center text-[#25324B] mb-6 font-[700]">
          Sign up today!
        </h1>
        <button className="flex items-center w-[408px] h-[50px] rounded-[5px] border-[1px] border-[#CCCCF5] py-[12px] px-[16px] gap-[10px]">
          <Image src="/googleIcon.svg" alt="Icon" width={24} height={24} />
          <span className="w-[161px] h-[26px] text-[#4640DE] text-[16px] font-[700] leading-[25.6px] text-center">
            Sign Up with Google
          </span>
        </button>

        <div className="relative flex items-center justify-center top-[25px]">
          <div className="absolute w-[90px] border-t-[1px] border-[#D6DDEB] top-[25px] left-[-10px]"></div>
          <div className="absolute w-[90px] border-t-[1px] border-[#D6DDEB] top-[25px] right-[-10px]"></div>
          <span className="relative w-[161px] h-[26px] text-[#202430] text-[15px] font-[600] leading-[25.6px] text-center opacity-[0.5] top-[7px]">
            Or Sign Up with Email
          </span>
        </div>

        <div className="h-10"></div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className=" text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
            ></button>
          </div>
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />


            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
            ></button>

          </div>

          <button
            type="submit"
            className="w-full bg-[#2D298E] text-white py-2 rounded-3xl hover:bg-[#1f1aaa] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Continue"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;