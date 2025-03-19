import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Log what we're sending
    console.log('Sending request to backend with file size:', 
      formData.get('csvFile') instanceof File ? 
      (formData.get('csvFile') as File).size : 'No file');

    const response = await fetch("https://cs6510-renewvia6-kk01.onrender.com/process", {
      method: "POST",
      body: formData,
      // Add a longer timeout (50 seconds)
      signal: AbortSignal.timeout(50000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend response error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Backend error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Detailed error:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // Check if it's a timeout error
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { message: "Request timed out - the server took too long to respond" },
        { status: 504 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}