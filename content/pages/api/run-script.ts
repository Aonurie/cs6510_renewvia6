import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await fetch("https://cs6510-renewvia6-kk01.onrender.com/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data); // Return the result from the backend
  } catch (error: unknown) {
    console.error("Error calling the backend:", error);

    // Type assertion to Error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return res.status(500).json({ message: "Server error", error: errorMessage });
  }
}
