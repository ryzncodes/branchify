import { NextResponse } from 'next/server';

interface IJson {
  [key: string]: string | number | boolean | IJson;
}

export async function POST(request: Request) {
   try {
     const { jsonString } = await request.json();  // Parse JSON from the request body
 
     const parsedJson: IJson = JSON.parse(jsonString);  // Try parsing the JSON string
 
     return NextResponse.json(parsedJson);  // Return parsed JSON as the response
   } catch {
     return NextResponse.json({ error: 'Invalid JSON string' }, { status: 400 });  // Error response
   }
 }
 