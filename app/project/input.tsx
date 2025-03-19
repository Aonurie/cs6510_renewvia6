"use client";

import React, { useState } from "react";

const Input: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [polesCost, setPolesCost] = useState("");
  const [mvCablesCost, setMvCablesCost] = useState("");
  const [lvCablesCost, setLvCablesCost] = useState("");
  const [loading, setLoading] = useState(false);
  const [plotUrl, setPlotUrl] = useState(""); // Store the returned plot URL

  // Update this URL with your actual backend URL
  //const BACKEND_URL = "https://cs6510-renewvia6-kk01.onrender.com";

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setPlotUrl(""); // Reset previous plot

    if (!excelFile) {
      alert("Please upload an Excel file.");
      setLoading(false);
      return;
    }

    // Create a FormData object to send file + inputs
    const formData = new FormData();
    formData.append("excelFile", excelFile);
    formData.append("polesCost", polesCost);
    formData.append("mvCablesCost", mvCablesCost);
    formData.append("lvCablesCost", lvCablesCost);

    try {
      const response = await fetch("/api/run-script", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process data.");
      }

      const result = await response.json();
      setPlotUrl(result.plot_url); // Expecting backend to return the plot URL
    } catch (error) {
      console.error("Error:", error);
      alert("Error processing the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="excelFile">Excel File:</label>
        <input type="file" id="excelFile" accept=".xls,.xlsx" onChange={handleExcelFileChange} />
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

      {plotUrl && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Generated Plot:</h3>
          <img src={plotUrl} alt="Generated Plot" style={{ width: "100%", maxWidth: "500px" }} />
        </div>
      )}
    </form>
  );
};

export default Input;
