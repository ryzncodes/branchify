import { NextResponse } from 'next/server';
import { getAllJson } from '../../../db/database'; // Assuming you have getAllJson function exported from your database file

export async function GET() {
  try {
    // Fetch all JSON records from the database using the helper function
    const rows = await getAllJson();  // Get all JSON data from the DB

    // Parse the data string to remove escape characters like \n
    const parsedRows = rows.map((row: { data: string; }) => {
      try {
        // Assuming 'data' is the field containing the ugly JSON string
        const parsedData = JSON.parse(row.data);  // Parse the JSON string to remove escape characters
        return { ...row, data: parsedData }; // Return the row with parsed data
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        return row; // If parsing fails, return the original row
      }
    });

    // Return the parsed rows as a JSON response
    return NextResponse.json({ data: parsedRows });
  } catch (error) {
    console.error('Error fetching data from the database', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
