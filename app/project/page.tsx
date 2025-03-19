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
      <p style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#333" }}>
        *This page allows users to enter their own test data and cost hyperparameters for an optimized energy grid design.<br /><br />
        Test data: An Excel file with GPS coordinates for buildings & a power source (solar grid) in a community. The file must have the following columns:
        <ul>
          <li> - name (indicating &apos;Building&apos; or &apos;Power Source&apos;)</li>
          <li> - latitude</li>
          <li> - longitude</li>
        </ul>
        Cost hyperparameters: Pole cost, MV Cable cost, LV Cable cost (all in USD).<br />
        Output: A visual of an optimal grid design based on given data.
      </p>
      
      {/* Download Links Description */}
      <div style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#333" }}>
        Below you can download two test data files for use:
      </div>
      {/* Two Download Links Section */}
      <div style={{ marginBottom: "1rem" }}>
        <a href="/files/BuildingCoordinate1.csv" download="BuildingCoordinate1.csv" style={{ marginRight: "1rem" }}>
          Download Test Data 1 CSV 
        </a>
        <a href="/files/BuildingCoordinate(2).csv" download="BuildingCoordinate(2).csv">
          Download Test Data 2 CSV
        </a>
      </div>
      <h1 style={{ marginBottom: "1rem" }}><strong>Upload Test GPS Coordinate Data and Enter Cost Hyperparameters</strong></h1>
      <Input />
    </div>
  );
}