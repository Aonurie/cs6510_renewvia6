"use client";

import { useState } from "react";

export default function ExcelProcessor() {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [costPoles, setCostPoles] = useState("");
  const [costMVCables, setCostMVCables] = useState("");
  const [costLVCables, setCostLVCables] = useState("");
  const [costTransformers, setCostTransformers] = useState("");
  const [costDropCables, setCostDropCables] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setExcelFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!excelFile) {
      alert("Please upload an Excel file");
      return;
    }

    const formData = new FormData();
    formData.append("excelFile", excelFile);
    formData.append("costPoles", costPoles);
    formData.append("costMVCables", costMVCables);
    formData.append("costLVCables", costLVCables);
    formData.append("costTransformers", costTransformers);
    formData.append("costDropCables", costDropCables);

    const response = await fetch("/api/process-excel", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "processed.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error("Failed to process the Excel file.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Upload Excel File:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      </div>
      <div>
        <label>Cost Poles:</label>
        <input
          type="text"
          value={costPoles}
          onChange={(e) => setCostPoles(e.target.value)}
        />
      </div>
      <div>
        <label>Cost MV Cables:</label>
        <input
          type="text"
          value={costMVCables}
          onChange={(e) => setCostMVCables(e.target.value)}
        />
      </div>
      <div>
        <label>Cost LV Cables:</label>
        <input
          type="text"
          value={costLVCables}
          onChange={(e) => setCostLVCables(e.target.value)}
        />
      </div>
      <div>
        <label>Cost Transformers:</label>
        <input
          type="text"
          value={costTransformers}
          onChange={(e) => setCostTransformers(e.target.value)}
        />
      </div>
      <div>
        <label>Cost Drop Cables:</label>
        <input
          type="text"
          value={costDropCables}
          onChange={(e) => setCostDropCables(e.target.value)}
        />
      </div>
      <button type="submit">Process Excel</button>
    </form>
  );
}
