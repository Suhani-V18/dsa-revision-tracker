import { useState } from "react";
import Papa from "papaparse";
import { bulkImportProblems } from "../api/api";

function BulkImport({ onImported }) {
  const [preview, setPreview] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e) => {
    setError("");
    setStatus("");
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`CSV parse error: ${results.errors[0].message}`);
          return;
        }
        const cleaned = results.data.map((row) => ({
          title: row.title?.trim(),
          topic: row.topic?.trim(),
          difficulty: row.difficulty?.trim(),
          link: row.link?.trim() || "",
          expectedTimeMinutes: Number(row.expectedTimeMinutes) || 25,
        }));
        setPreview(cleaned);
        setStatus(`${cleaned.length} problems ready to import.`);
      },
    });
  };

  const handleImport = async () => {
    setStatus("Importing...");
    setError("");
    try {
      const res = await bulkImportProblems(preview);
      setStatus(`Imported ${res.data.count} problems.`);
      setPreview([]);
      onImported();
    } catch (err) {
      setError(`Import failed: ${err.response?.data?.error || err.message}`);
      console.error("Bulk import error:", err);
    }
  };

  return (
    <div
      style={{
        marginTop: "2.5rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e5e0",
      }}
    >
      <p
        style={{
          fontFamily: "Helvetica Neue, sans-serif",
          fontSize: "0.8rem",
          color: "#666",
          marginBottom: "0.5rem",
        }}
      >
        Bulk import problems (CSV)
      </p>
      <input type="file" accept=".csv" onChange={handleFile} />

      {preview.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={handleImport}>Import all</button>
        </div>
      )}

      {status && (
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.8rem",
            color: "#888",
            marginTop: "0.5rem",
          }}
        >
          {status}
        </p>
      )}
      {error && (
        <p
          style={{
            fontFamily: "Helvetica Neue, sans-serif",
            fontSize: "0.8rem",
            color: "#c0392b",
            marginTop: "0.5rem",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default BulkImport;
