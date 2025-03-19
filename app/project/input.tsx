"use client";

import React, { useState } from "react";

const Input: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [polesCost, setPolesCost] = useState("");
  const [mvCablesCost, setMvCablesCost] = useState("");
  const [lvCablesCost, setLvCablesCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [plotUrl, setPlotUrl] = useState(""); // Store the returned plot URL
  const [totalCost, setTotalCost] = useState<number | null>(null); // Store the total cost
  const [error, setError] = useState<string | null>(null);

  // Update this URL with your actual backend URL
  //const BACKEND_URL = "https://cs6510-renewvia6-kk01.onrender.com";

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
      setError(null); // Clear any previous errors
      setPlotUrl(""); // Clear the previous plot
      setTotalCost(null); // Clear the previous cost
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPlotUrl("");
    setTotalCost(null);
    setError(null);

    if (!csvFile) {
      setError("Please upload a CSV file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("polesCost", polesCost || "0");
    formData.append("mvCablesCost", mvCablesCost || "0");
    formData.append("lvCablesCost", lvCablesCost || "0");

    try {
      // Create an AbortController for the timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

      const response = await fetch("/api/run-script", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to process data: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const fullPlotUrl = `https://cs6510-renewvia6-kk01.onrender.com${result.plot_url}?t=${timestamp}`;
      setPlotUrl(fullPlotUrl);
      setTotalCost(result.total_cost);
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError("Request timed out. The server is warming up. Please try again in a few moments.");
        } else {
          setError(error.message);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="csvFile">CSV File:</label>
        <input 
          type="file" 
          id="csvFile" 
          accept=".csv"
          onChange={handleCsvFileChange}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="polesCost">Poles Cost:</label>
        <input type="text" id="polesCost" value={polesCost} onChange={(e) => setPolesCost(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="mvCablesCost">MV Cables Cost:</label>
        <input type="text" id="mvCablesCost" value={mvCablesCost} onChange={(e) => setMvCablesCost(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="lvCablesCost">LV Cables Cost:</label>
        <input type="text" id="lvCablesCost" value={lvCablesCost} onChange={(e) => setLvCablesCost(e.target.value)} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          {error}
        </div>
      )}

      {plotUrl && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Generated Plot:</h3>
          <img 
            src={plotUrl} 
            alt="Generated Plot" 
            style={{ width: "100%", maxWidth: "500px" }}
            key={plotUrl} // Add key to force re-render
          />
          {totalCost !== null && (
            <div style={{ marginTop: "1rem" }}>
              <h3>Total Cost:</h3>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default Input;
