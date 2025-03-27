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
      {/* Project Objective Header and Paragraph */}
      <h1 style={{ marginBottom: "1rem", fontSize: "2rem", fontWeight: "bold"}}>
        Project Objective
      </h1>
      <p style={{ marginBottom: "2rem", fontSize: "1.1rem", lineHeight: "1.6" }}>
        This project aims to design an optimized and cost-effective energy grid for an area in Kenya. The goal is to factor in pole cost, 
        low and medium voltage cables, and transformers and build an optimal power grid. The constraints given by the partner are MV max Pole
        distance = 50m, LV max pole distance = 30m, max distance from pole to building = 20 meters, and max voltage drop 10% of source voltage. No 
        other constraints were given.
      </p>

      {/* Explanation Paragraph */}
      <p style={{ marginBottom: "1rem", fontSize: "0.775rem", color: "#333" }}>
        *This page allows users to enter their own test data and cost hyperparameters for an optimized energy grid design.<br /><br />
        Test data: A CSV file with GPS coordinates for buildings & a power source (solar grid) in a community. The file must have the following columns: 
        name (Building or Power Source), latitude, longitude.<br />
        Cost hyperparameters: Pole cost, MV Cable cost, LV Cable cost.<br />
        Output: A visual of an optimal grid design based on given data as well as its total cost.
      </p>
      
      {/* Download Links Description */}
      <div style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#333" }}>
        Below you can download two test data files for use:
      </div>
      {/* Two Download Links Section */}
      <div style={{ marginBottom: "1rem", fontSize: "0.875rem" }}>
        <a href="/files/BuildingCoordinate1.csv" download="BuildingCoordinate1.csv" style={{ marginRight: "1rem", color: "blue" }}>
          Download Test Data 1 CSV 
        </a>
        <a href="/files/BuildingCoordinate(2).csv" download="BuildingCoordinate(2).csv" style={{ color: "blue" }}>
          Download Test Data 2 CSV
        </a>
      </div>
      <h1 style={{ marginBottom: "1rem" }}><strong>Upload Test GPS Coordinate Data and Enter Cost Hyperparameters(Please be patient can take a little bit to build)  </strong></h1>
      <Input />
    </div>
  );
}