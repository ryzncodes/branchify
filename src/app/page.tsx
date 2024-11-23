"use client";

import { useState } from "react";

// Define types for the JSON data
type IJson = string | number | boolean | IJsonObject;
interface IJsonObject {
  [key: string]: IJson | IJsonObject;
}

export default function Page() {
  const [jsonString, setJsonString] = useState<string>(""); 
  const [jsonResponse, setJsonResponse] = useState<IJsonObject | null>(null);

  // Handle pasting JSON string
  const handleJsonUpload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(event.target.value);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        if (fileContent) {
          try {
            const parsedJson = JSON.parse(fileContent as string);
            setJsonString(JSON.stringify(parsedJson, null, 2)); // format with indentation
            setJsonResponse(parsedJson); // Set the response to display it
          } catch (error) {
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
    try {
      // Parse the pasted JSON string into an object
      const parsedJson = JSON.parse(jsonString);
      setJsonResponse(parsedJson);
    } catch (error) {
      console.error("Invalid JSON format", error);
    }
  };

  // Recursive function to render JSON with collapsible sections
  const renderJson = (data: IJson, key?: string) => {
    // If the data is an object or array, render it recursively
    if (typeof data === "object" && data !== null) {
      if (Array.isArray(data)) {
        return (
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                {/* Render each item in an array with its own collapsible behavior */}
                {renderJson(item, `${key ? `${key}[${index}]` : index}`)}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <div style={{ paddingLeft: "20px" }}>
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
      return <span>{JSON.stringify(data)}</span>;
    }
  };

  // Collapsible component
  const CollapsibleItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div>
        <button onClick={() => setIsOpen(!isOpen)} style={{ marginBottom: "5px" }}>
          {isOpen ? "−" : "+"} {label}
        </button>
        {isOpen && <div>{children}</div>}
      </div>
    );
  };

  return (
    <div>
      <h1>JSON String Upload</h1>
      
      {/* Textarea for pasting JSON */}
      <textarea
        value={jsonString}
        onChange={handleJsonUpload}
        placeholder="Paste your JSON here"
        rows={10}
        cols={50}
      />
      <button onClick={handleSubmit}>Submit</button>

      {/* File input for uploading JSON */}
      <div>
        <input type="file" accept=".json" onChange={handleFileUpload} />
      </div>

      {/* Render deserialized JSON */}
      {jsonResponse && (
        <div>
          <h2>Deserialized JSON</h2>
          <div>{renderJson(jsonResponse)}</div>
        </div>
      )}
    </div>
  );
}
