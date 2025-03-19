import type { NextApiRequest, NextApiResponse } from "next";

// Define the handler for the API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Prepare the form data
    const formData = new FormData();
    formData.append("excelFile", req.body.excelFile);
    formData.append("polesCost", req.body.polesCost);
    formData.append("mvCablesCost", req.body.mvCablesCost);
    formData.append("lvCablesCost", req.body.lvCablesCost);

    // Send the FormData to your Flask backend
    const response = await fetch("https://cs6510-renewvia6-kk01.onrender.com/process", {
      method: "POST",
      body: formData, // FormData is correctly sent here
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data); // Return the result from Flask
  } catch (error) {
    console.error("Error calling the backend:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
