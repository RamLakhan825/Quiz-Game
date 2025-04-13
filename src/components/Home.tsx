import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AnimationPage: React.FC = () => {
  const [animationState, setAnimationState] = useState(false);
  const [slideOut, setSlideOut] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState(true);
    }, 500); // Start animation after 0.5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    setSlideOut(true); // Set the state to trigger the slide-out animation
    setTimeout(() => {
      navigate("/assessment"); // Navigate to the assessment page after transition
    }, 500); // Delay navigation to match the transition time
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-500 to-blue-500 text-white transition-transform duration-500 ${
        slideOut ? "transform -translate-x-full" : ""
      }`}
    >
      {/* Intro Text */}
      <div
        className={`text-center ${animationState ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-100px]"} transition-all duration-1000 ease-in-out`}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to the CA MONK Assessment</h1>
        <p className="text-lg">Your path to becoming successful starts here.</p>
      </div>

      {/* Progress Bar */}
      <div
        className={`w-full bg-gray-600 h-2 my-8 ${animationState ? "animate-progress-bar" : ""}`}
      >
        <div className="bg-green-500 h-full w-0"></div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart} // Call handleStart on button click
        className={`px-6 py-2 rounded bg-blue-600 text-white font-semibold transition-all duration-500 ease-in-out transform ${
          animationState ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[100px]"
        }  hover:text-black hover:scale-110 cursor-pointer`}
      >
        Start Assessment
      </button>
    </div>
  );
};

export default AnimationPage;
