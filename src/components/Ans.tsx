import React, { useEffect, useState } from "react";
import QuestionCard from "./Qcard";
import data from "../data.json"; // Adjust the path if necessary

const Ans: React.FC = () => {
  const questions = data.questions;
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]); 
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for each question
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
    setTimeLeft(30); // Reset timer to 30 seconds for the first question
    setCurrent(0); // Go back to the first question
    setFilledAnswers({});
    setSubmitted(false); // Reset the submitted flag
  };

  useEffect(() => {
    if (submitted) return;

    // Timer for the current question
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // If we are on the last question, submit the quiz automatically
          if (current === questions.length - 1) {
            handleSubmit();
          } else {
            // Auto-navigate to the next question when the timer ends
            setCurrent((prevCurrent) => Math.min(prevCurrent + 1, questions.length - 1));
            setTimeLeft(30); // Reset timer for the next question
          }
          return 30; // Reset timer after moving to the next question or submitting
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, current]); // Re-run the effect when the current question changes

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60)
      .toString()
      .padStart(2, "0")}`;

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Check if all blanks are filled to enable "Next" button
  const isNextButtonEnabled = filledAnswers[current]?.every((answer) => answer !== null);

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      setTimeLeft(30); // Reset timer when moving to the next question
    }
  };

  // Calculate the score out of 10
  const maxScore = 10; // Total score out of 10
  const totalQuestions = questions.length;
  const normalizedScore = Math.min((score / totalQuestions) * maxScore, maxScore);
  return (
    <div
      className={`p-8 mt-10 mb-10 max-w-4xl mx-auto ${
        darkMode ? "bg-black bg-opacity-90 text-white" : "bg-gray-100 text-gray-800"
      } rounded-lg shadow-lg`}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className={`bg-gray-200 px-6 py-3 rounded-lg text-xl font-semibold text-black`}>
            ⏱ {formatTime(timeLeft)}
          </div>

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
            <span className="font-bold text-green-700">{Math.round(normalizedScore)}</span> / {maxScore}
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
            {current < questions.length - 1 ? (
              <button
                onClick={handleNext} // Navigate to the next question and reset timer
                disabled={!isNextButtonEnabled} // Enable only when all blanks are filled
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
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
