import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ReviewPage from "./pages/ReviewPage";
import ImportPage from "./pages/ImportPage";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <BrowserRouter>
      <div className="container">
        <h1>DSA revision tracker</h1>
        <p className="subtitle">
          Weighted revision priority, based on your solve history.
        </p>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                refreshKey={refreshKey}
                onAttemptLogged={handleUpdate}
              />
            }
          />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route
            path="/import"
            element={<ImportPage onImported={handleUpdate} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
