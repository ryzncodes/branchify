import { NextResponse } from 'next/server';
import { insertJson } from '../../../db/database';

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
    // Parse the JSON body from the request
    const { jsonString } = await request.json(); 

    // Validate the JSON string (ensure it's not empty)
    if (!jsonString || jsonString.trim() === "") {
      return NextResponse.json({ error: 'JSON string cannot be empty.' }, { status: 400 });
    }

    // Try parsing the JSON string
    let parsedJson: IJson;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    // Insert the valid JSON string into the database
    insertJson(jsonString);

    // Return the parsed JSON as the response
    return NextResponse.json(parsedJson);
  } catch (error) {
    console.error("Error processing the JSON", error);
    return NextResponse.json({ error: 'An error occurred while processing the request.' }, { status: 500 });
  }
}
