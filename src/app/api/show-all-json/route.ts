import { NextResponse } from 'next/server';
import { getAllJson } from '../../../db/database'; // Assuming you have getAllJson function exported from your database file

export async function GET() {
  try {
    // Fetch all JSON records from the database using the helper function
    const rows = getAllJson();  // Get all JSON data from the DB

    // Return the fetched rows as a JSON response
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching data from the database', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
