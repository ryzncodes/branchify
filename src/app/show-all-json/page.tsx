"use client";

import { useEffect, useState } from "react";

type IJson = string | number | boolean | IJsonObject;
interface IJsonObject {
  [key: string]: IJson | IJsonObject;
}

export default function ShowAllJson() {
  const [jsonData, setJsonData] = useState<IJsonObject[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch the data from the backend API
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch('/api/show-all-json');
        const data = await response.json();

        if (response.ok) {
          setJsonData(data.data);  // Set the fetched data
        } else {
          setError(data.error);  // Handle error response
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      }
    };

    fetchJsonData();
  }, []);

  // Render JSON data
  const renderJson = (data: IJson, key?: string) => {
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return (
          <ul className="pl-6">
            {data.map((item, index) => (
              <li key={index} className="my-1">
                {renderJson(item, `${key ? `${key}[${index}]` : index}`)}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <div className="pl-6">
            {Object.entries(data).map(([subKey, value]) => (
              <div key={subKey}>
                <div>{subKey}: {renderJson(value, subKey)}</div>
              </div>
            ))}
          </div>
        );
      }
    } else {
      return <span>{JSON.stringify(data)}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">All Stored JSON</h1>

      {/* Show error if any */}
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

      {/* Render JSON data */}
      {jsonData.length === 0 ? (
        <p>No data found.</p>
      ) : (
        jsonData.map((json, index) => (
          <div key={index} className="mb-12 bg-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Record {index + 1}</h2>
            <div>{renderJson(json)}</div>
          </div>
        ))
      )}
    </div>
  );
}
