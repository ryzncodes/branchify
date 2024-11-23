import Database from 'better-sqlite3';

// Open (or create) an SQLite database file
const db = new Database('src/db/db.sqlite', { verbose: console.log });

// Create a table for storing JSON data (if it doesn't already exist)
db.prepare(`
  CREATE TABLE IF NOT EXISTS json_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT
  );
`).run();

export default db;

// Function to insert JSON data into the database
export function insertJson(jsonString: string) {
  const insert = db.prepare('INSERT INTO json_data (data) VALUES (?)');
  insert.run(jsonString);
}
