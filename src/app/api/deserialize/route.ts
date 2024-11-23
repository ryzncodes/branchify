import { NextResponse } from 'next/server';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

interface IJson {
  [key: string]: string | number | boolean | IJson;
}

export async function POST(request: Request) {
  try {
    // Check for content-length header and validate size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum allowed size is 100MB.' },
        { status: 413 } // Payload Too Large
      );
    }

    // Parse JSON from the request body
    const { jsonString } = await request.json();

    // Validate if the jsonString is not empty
    if (!jsonString || jsonString.trim() === "") {
      return NextResponse.json(
        { error: 'JSON string cannot be empty.' },
        { status: 400 }
      );
    }

    // Try parsing the JSON string
    const parsedJson: IJson = JSON.parse(jsonString); 

    return NextResponse.json(parsedJson); // Return parsed JSON as the response

  } catch {
    // Return error response for invalid JSON format
    return NextResponse.json({ error: 'Invalid JSON string' }, { status: 400 });
  }
}
