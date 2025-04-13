import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AnimationPage from "./components/Home"; // Home page with animation
import Ans from "./components/Ans"; // Assessment page

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AnimationPage />} /> {/* Use element prop instead of component */}
        <Route path="/assessment" element={<Ans />} />
      </Routes>
    </Router>
  );
};

export default App;
