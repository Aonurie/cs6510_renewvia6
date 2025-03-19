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

  const BACKEND_URL = "https://cs6510-renewvia6-kk01.onrender.com";

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

      const response = await fetch(`${BACKEND_URL}/process`, {
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
      const fullPlotUrl = `https://cs6510-renewvia6-kk01.onrender.com${result.plot_url}`;
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
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="csvFile" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          CSV File:
        </label>
        <input 
          type="file" 
          id="csvFile" 
          accept=".csv"
          onChange={handleCsvFileChange}
          style={{ width: "100%", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        />
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="polesCost" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Poles Cost:
        </label>
        <input 
          type="text" 
          id="polesCost" 
          value={polesCost} 
          onChange={(e) => setPolesCost(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "0.5rem", 
            border: "1px solid #e0e0e0", 
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontSize: "1rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        />
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="mvCablesCost" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          MV Cables Cost:
        </label>
        <input 
          type="text" 
          id="mvCablesCost" 
          value={mvCablesCost} 
          onChange={(e) => setMvCablesCost(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "0.5rem", 
            border: "1px solid #e0e0e0", 
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontSize: "1rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        />
      </div>
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="lvCablesCost" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          LV Cables Cost:
        </label>
        <input 
          type="text" 
          id="lvCablesCost" 
          value={lvCablesCost} 
          onChange={(e) => setLvCablesCost(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "0.5rem", 
            border: "1px solid #e0e0e0", 
            borderRadius: "4px",
            backgroundColor: "#ffffff",
            color: "#000000",
            fontSize: "1rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: loading ? "#ccc" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "1rem"
        }}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", color: "red", padding: "0.75rem", backgroundColor: "#fee", borderRadius: "4px" }}>
          {error}
        </div>
      )}

      {plotUrl && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Generated Plot:</h3>
          <img 
            src={plotUrl} 
            alt="Generated Plot" 
            style={{ width: "100%", maxWidth: "500px", borderRadius: "4px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
          />
          {totalCost !== null && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ marginBottom: "0.5rem" }}>Total Cost:</h3>
              <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0070f3" }}>
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
