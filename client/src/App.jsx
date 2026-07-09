import { useState } from "react";
import "./index.css";
import Revision from "./components/RevisionQueue";
import AttemptForm from "./components/AttemptForm";
import Explanation from "./components/Explanation";
import Streak from "./components/Streak";
import BulkImport from "./components/BulkImport";
function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAttemptLogged = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container">
      <h1>DSA revision tracker</h1>
      <p className="subtitle">
        Weighted revision priority, based on your solve history.
      </p>
      <Streak refreshKey={refreshKey} />
      <Revision key={refreshKey} />
      <Explanation refreshKey={refreshKey} />
      <AttemptForm onAttemptLogged={handleAttemptLogged} />
      <BulkImport onImported={handleAttemptLogged} />
    </div>
  );
}

export default App;
