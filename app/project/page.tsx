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
      <h1>Upload Excel and Enter Costs</h1>
      <Input />
    </div>
  );
}