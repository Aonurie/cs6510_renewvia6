import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { polesCost, mvCablesCost, lvCablesCost } = req.body;

  // Define the path to the Python script inside Vercel's function folder
  const scriptPath = path.join(process.cwd(), "api", "grid-designer", "UI_graph_alg.py");

  // Ensure script exists
  if (!fs.existsSync(scriptPath)) {
    return res.status(500).json({ error: "Python script not found" });
  }

  // Run Python script with arguments
  const pythonProcess = spawn("python3", [
    scriptPath,
    polesCost,
    mvCablesCost,
    lvCablesCost,
  ]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      return res.status(200).json({ message: "Script executed", output });
    } else {
      return res.status(500).json({ error: errorOutput || "Unknown error occurred" });
    }
  });
}
