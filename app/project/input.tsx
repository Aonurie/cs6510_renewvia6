"use client";

import React, { useState } from "react";

const Input: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [polesCost, setPolesCost] = useState("");
  const [mvCablesCost, setMvCablesCost] = useState("");
  const [lvCablesCost, setLvCablesCost] = useState("");
  const [transformersCost, setTransformersCost] = useState("");
  const [dropCablesCost, setDropCablesCost] = useState("");

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Excel File:", excelFile);
    console.log("Poles Cost:", polesCost);
    console.log("MV Cables Cost:", mvCablesCost);
    console.log("LV Cables Cost:", lvCablesCost);
    console.log("Transformers Cost:", transformersCost);
    console.log("Drop Cables Cost:", dropCablesCost);
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
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="transformersCost">Transformers Cost:</label>
        <input type="text" id="transformersCost" value={transformersCost} onChange={(e) => setTransformersCost(e.target.value)} />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="dropCablesCost">Drop Cables Cost:</label>
        <input type="text" id="dropCablesCost" value={dropCablesCost} onChange={(e) => setDropCablesCost(e.target.value)} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Input;