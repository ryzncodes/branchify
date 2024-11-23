"use client";

import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { useEffect, useState } from "react";

// Define types for the JSON data
type IJson = string | number | boolean | IJsonObject;
interface IJsonObject {
  [key: string]: IJson | IJsonObject;
}

// Define a response type for the fetched data
interface IApiResponse {
  data: string[]; // Assuming the data is an array of JSON strings
  error?: string;  // Optional error message
}

export default function ShowAllJson() {
  const [jsonData, setJsonData] = useState<IJsonObject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();  // Initialize useRouter hook

  // Fetch the data from the backend API
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch('/api/show-all-json');
        const data: IApiResponse = await response.json(); // Explicitly type the response

        if (response.ok) {
          // Parse the JSON strings if necessary
          const parsedData = data.data.map((item) => {
            // If the item is a string, parse it into an object
            if (typeof item === 'string') {
              return JSON.parse(item);  // Parse JSON string
            }
            return item;  // If it's already an object, return it
          });
          setJsonData(parsedData);  // Set the parsed data
        } else {
          setError(data.error || "Unknown error");  // Handle error response
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      }
    };

    fetchJsonData();
  }, []);

  // Render JSON data recursively
  const renderJson = (data: IJson, key?: string) => {
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return (
          <ul className="pl-6 space-y-2">
            {data.map((item, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded-md shadow-sm hover:bg-gray-200">
                {renderJson(item, `${key ? `${key}[${index}]` : index}`)}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <div className="pl-6 space-y-2">
            {Object.entries(data).map(([subKey, value]) => (
              <div key={subKey} className="bg-gray-100 p-2 rounded-md shadow-sm hover:bg-gray-200">
                <div className="font-semibold text-gray-700">{subKey}:</div>
                <div className="pl-4">{renderJson(value, subKey)}</div>
              </div>
            ))}
          </div>
        );
      }
    } else {
      return <span className="text-gray-800">{JSON.stringify(data)}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 space-y-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">All Stored JSON Records</h1>

      {/* Show error if any */}
      {error && (
        <div className="text-red-600 text-center text-lg font-medium">
          <p>{error}</p>
        </div>
      )}

      {/* Render JSON data */}
      {jsonData.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">No data found.</div>
      ) : (
        jsonData.map((json, index) => (
          <div key={index} className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Record {index + 1}</h2>
            <div className="overflow-hidden">{renderJson(json)}</div>
          </div>
        ))
      )}

      {/* Floating button for navigating back to the main page */}
      <button
        onClick={() => router.push('/')}  // Navigate to the main page
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Back to Main
      </button>
    </div>
  );
}
