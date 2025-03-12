"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';

const Input: React.FC = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [polesCost, setPolesCost] = useState<string>('');
  const [mvCablesCost, setMvCablesCost] = useState<string>('');
  const [lvCablesCost, setLvCablesCost] = useState<string>('');
  const [transformersCost, setTransformersCost] = useState<string>('');
  const [dropCablesCost, setDropCablesCost] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setExcelFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log({
      excelFile,
      polesCost,
      mvCablesCost,
      lvCablesCost,
      transformersCost,
      dropCablesCost,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="excel-upload">Upload Excel File:</label>
        <input
          type="file"
          id="excel-upload"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <label>Poles Cost:</label>
        <input
          type="number"
          placeholder="Enter Poles cost"
          value={polesCost}
          onChange={(e) => setPolesCost(e.target.value)}
        />
      </div>
      <div>
        <label>MV Cables Cost:</label>
        <input
          type="number"
          placeholder="Enter MV Cables cost"
          value={mvCablesCost}
          onChange={(e) => setMvCablesCost(e.target.value)}
        />
      </div>
      <div>
        <label>LV Cables Cost:</label>
        <input
          type="number"
          placeholder="Enter LV Cables cost"
          value={lvCablesCost}
          onChange={(e) => setLvCablesCost(e.target.value)}
        />
      </div>
      <div>
        <label>Transformers Cost:</label>
        <input
          type="number"
          placeholder="Enter Transformers cost"
          value={transformersCost}
          onChange={(e) => setTransformersCost(e.target.value)}
        />
      </div>
      <div>
        <label>Drop Cables Cost:</label>
        <input
          type="number"
          placeholder="Enter Drop Cables cost"
          value={dropCablesCost}
          onChange={(e) => setDropCablesCost(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Input;
