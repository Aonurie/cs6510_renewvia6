import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get the FormData from the request
    const formData = await request.formData();
    
    const response = await fetch("https://cs6510-renewvia6-kk01.onrender.com/process", {
      method: "POST",
      // Forward the FormData directly, don't convert to JSON
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error calling the backend:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}