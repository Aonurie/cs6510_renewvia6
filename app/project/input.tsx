"use client";

import React, { useState } from "react";

const Input: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [polesCost, setPolesCost] = useState("");
  const [mvCablesCost, setMvCablesCost] = useState("");
  const [lvCablesCost, setLvCablesCost] = useState("");

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const formData = {
      polesCost,
      mvCablesCost,
      lvCablesCost,
    };
  
    try {
      const response = await fetch("/api/run-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default Input;