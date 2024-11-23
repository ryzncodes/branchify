"use client";

import { useState } from "react";

// Define types for the JSON data
type IJson = string | number | boolean | IJsonObject;
interface IJsonObject {
  [key: string]: IJson | IJsonObject;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function Page() {
  const [jsonString, setJsonString] = useState<string>(""); 
  const [jsonResponse, setJsonResponse] = useState<IJsonObject | null>(null);
  const [error, setError] = useState<string | null>(null);  // State for handling errors

  // Handle pasting JSON string
  const handleJsonUpload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(event.target.value);
    setError(null);  // Clear error when user updates the JSON
  };

  // Handle file upload with size validation
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // File size validation
      if (file.size > MAX_FILE_SIZE) {
        setError("File is too large. Maximum allowed size is 100MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        if (fileContent) {
          try {
            const parsedJson = JSON.parse(fileContent as string);
            setJsonString(JSON.stringify(parsedJson, null, 2)); // format with indentation
            setJsonResponse(parsedJson); // Set the response to display it
            setError(null);  // Clear any previous error
          } catch (error) {
            setError("Error parsing the uploaded JSON file. Please check the format.");
            console.error("Error parsing the uploaded JSON file", error);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle form submission (submit pasted JSON)
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);  // Clear error before submitting

    if (!jsonString.trim()) {
      setError("JSON cannot be empty. Please paste a valid JSON.");
      return;
    }

    try {
      // Parse the pasted JSON string into an object
      const parsedJson = JSON.parse(jsonString);
      setJsonResponse(parsedJson);
    } catch (error) {
      setError("Invalid JSON format. Please check the syntax.");
      console.error("Invalid JSON format", error);
    }
  };

  // Recursive function to render JSON with collapsible sections
  const renderJson = (data: IJson, key?: string) => {
    // If the data is an object or array, render it recursively
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return (
          <ul className="pl-6">
            {data.map((item, index) => (
              <li key={index} className="my-1">
                {/* Render each item in an array with its own collapsible behavior */}
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
                {/* For each object property, render with collapsible functionality */}
                <CollapsibleItem label={subKey}>
                  {renderJson(value, subKey)}
                </CollapsibleItem>
              </div>
            ))}
          </div>
        );
      }
    } else {
      // If it's a primitive value, just render it
      return <span className="text-gray-700">{JSON.stringify(data)}</span>;
    }
  };

  // Collapsible component
  const CollapsibleItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {isOpen ? "−" : "+"} {label}
        </button>
        {isOpen && <div className="mt-2 pl-4">{children}</div>}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">JSON String Upload</h1>

      {/* Error message */}
      {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

      {/* Textarea for pasting JSON */}
      <div className="mb-4">
        <textarea
          value={jsonString}
          onChange={handleJsonUpload}
          placeholder="Paste your JSON here"
          rows={10}
          cols={50}
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
        {/* File input for uploading JSON */}
        <label
          htmlFor="file-upload"
          className="px-6 py-2 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Upload JSON
        </label>
        <input
          type="file"
          accept=".json"
          id="file-upload"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Render deserialized JSON */}
      {jsonResponse && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Deserialized JSON</h2>
          <div>{renderJson(jsonResponse)}</div>
        </div>
      )}
    </div>
  );
}
