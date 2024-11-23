import { NextResponse } from 'next/server';
import db from '../../../db/database'; // Import the database instance

export async function GET() {
  try {
    // Fetch all JSON records from the database
    const rows = db.prepare('SELECT * FROM json_data').all();

    // Return the fetched rows as a JSON response
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching data from the database', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
