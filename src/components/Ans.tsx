import React, { useEffect, useState } from "react";
import QuestionCard from "./Qcard";
import data from "../data.json"; // Adjust the path if necessary

const Ans: React.FC = () => {
  const questions = data.questions;
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]); 
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  // Track each question's filled state
  const [filledAnswers, setFilledAnswers] = useState<Record<number, (string | null)[]>>({});

  const handleScoreUpdate = (delta: number, index: number, answer: (string | null)[]) => {
    if (!completed.includes(index)) {
      setScore((prev) => prev + delta);
      setCompleted((prev) => [...prev, index]);
    }
    setFilledAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleAnswerChange = (answer: (string | null)[]) => {
    setFilledAnswers((prev) => ({ ...prev, [current]: answer }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRetest = () => {
    setScore(0);
    setCompleted([]);
    setTimeLeft(600); // Reset timer to 10 minutes
    setCurrent(0); // Go back to the first question
    setFilledAnswers({});
    setSubmitted(false); // Reset the submitted flag
  };

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`p-8 mt-10 mb-10 max-w-4xl mx-auto ${
        darkMode ? "bg-black bg-opacity-90 text-white" : "bg-gray-100 text-gray-800"
      } rounded-lg shadow-lg`}
    >
      <div className="flex justify-between items-center mb-6">
        {/* Title, Timer, and Dark Mode toggle in the same row */}
        <div className="flex items-center space-x-4">
          {/* Timer with grey background and black text */}
          <div className={`bg-gray-200 px-6 py-3 rounded-lg text-xl font-semibold text-black`}>
            ⏱ {formatTime(timeLeft)}
          </div>

          {/* Dark Mode toggle button */}
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      </div>

      {submitted ? (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">🎉 Quiz Submitted!</h2>
          <p className="text-xl">
            Your Final Score:{" "}
            <span className="font-bold text-green-700">{score}</span> /{" "}
            {questions.reduce((acc, q) => acc + q.correctAnswer.length, 0)}
          </p>
          <div className="mt-6">
            <button
              onClick={handleRetest}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              🔄 Retest
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-black">
            <QuestionCard
              questionData={questions[current]}
              onScoreUpdate={(delta, answer) =>
                handleScoreUpdate(delta, current, answer)
              }
              initialFilled={filledAnswers[current] ?? []}
              onAnswerChange={handleAnswerChange}
            />
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrent((prev) => prev - 1)}
              disabled={current === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              ⬅ Back
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent((prev) => prev + 1)}
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Next ➡
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-all"
              >
                ✅ Submit
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Ans;
