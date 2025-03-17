import React from "react";
import Input from "./input";

export async function generateMetadata() {
  return {
    title: "Project Page",
    description: "This is the interactive project page with file upload and cost entries.",
  };
}

export default function ProjectPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <p style={{ marginBottom: "1rem", fontSize: "1rem", color: "#333" }}>
        This page allows users to enter their own test data and cost hyperparameters for an optimized energy grid design.<br /><br />
        
        <strong>Test data:</strong> An Excel file with GPS coordinates for buildings & a power source (solar grid) in a community. The file must have the following columns:
        <ul>
          <li><strong>name</strong> (indicating 'Building' or 'Power Source')</li>
          <li><strong>latitude</strong></li>
          <li><strong>longitude</strong></li>
        </ul>

        <strong>Cost hyperparameters:</strong> Pole cost, MV Cable cost, LV Cable cost (all in USD).<br /><br />

        <strong>Output:</strong> A visual of an optimal grid design based on given data.
      </p>
      <h1 style={{ marginBottom: "1rem" }}>Upload Test GPS Coordinate Data and Enter Test Costs</h1>
      <Input />
    </div>
  );
}