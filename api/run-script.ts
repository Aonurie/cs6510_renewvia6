import type { NextApiRequest, NextApiResponse } from "next";
import FormData from "form-data"; // Import the form-data library
import fetch from "node-fetch"; // Import fetch for server-side calls

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const formData = new FormData();
    formData.append("excelFile", req.body.excelFile); // File object
    formData.append("polesCost", req.body.polesCost);
    formData.append("mvCablesCost", req.body.mvCablesCost);
    formData.append("lvCablesCost", req.body.lvCablesCost);

    const response = await fetch("https://cs6510-renewvia6-kk01.onrender.com/process", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data); // Send the response from the Flask backend
  } catch (error) {
    console.error("Error calling the backend:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
