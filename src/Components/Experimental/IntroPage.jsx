import React, { useEffect, useRef } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";

const IntroPage = () => {
  const formRef = useRef(null);

  useEffect(() => {
    // Initialize Intro.js tutorial
const timer = setTimeout(() => {
    introJs()
      .setOptions({
        steps: [
          {
            element: ".form-title",
            intro: "👋 Welcome! This is your onboarding tutorial.",
            tooltipClass: "custom-intro"
          },
          {
            element: ".input-name",
            intro: "Start by entering your full name here.",
            tooltipClass: "custom-intro"
          },
          {
            element: ".input-email",
            intro: "Next, provide a valid email address.",
            tooltipClass: "custom-intro"
          },
          {
            element: ".select-role",
            intro: "Select your role from this dropdown.",
            tooltipClass: "custom-intro"
          },
          {
            element: ".submit-btn",
            intro: "Finally, click this button to submit your form.",
            tooltipClass: "custom-intro"
          },
        ],
        showProgress: true,
        showBullets: false,
        exitOnOverlayClick: false,
        nextLabel: "Next →",
        prevLabel: "← Back",
        doneLabel: "Finish 🎉",
      })
      .start();
    }, 500); // Delay to ensure elements are rendered

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div
        ref={formRef}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-5 relative"
      >
        <h2 className="form-title text-2xl font-semibold text-gray-800">
          User Registration
        </h2>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="input-name w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-email w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select className="select-role w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select role</option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="designer">Designer</option>
          </select>
        </div>

        <button className="submit-btn w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition">
          Submit
        </button>
      </div>
    </div>
  );
};

export default IntroPage;
