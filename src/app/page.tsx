"use client";

import { useState } from "react";
import axios from "axios";
import Select from "react-select";

const options = [
  { value: "alphabets", label: "Alphabets" },
  { value: "numbers", label: "Numbers" },
  { value: "highest_lowercase_alphabet", label: "Highest Lowercase Alphabet" },
];

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>("");
  const [response, setResponse] = useState<any>(null); // Stores the raw response
  const [filteredData, setFilteredData] = useState<any>(null); // Stores the filtered response
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const parsedJson = JSON.parse(jsonInput);

      const { data } = await axios.post("/api/bfhl", parsedJson);
      setResponse(data); // Set the raw response
      setFilteredData(null); // Clear any previous filters
    } catch (err) {
      setError("Invalid JSON or server error. Please try again.");
      setResponse(null);
      setFilteredData(null);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (!response || selectedOptions.length === 0) return;

    const result: any = {};
    selectedOptions.forEach((option) => {
      result[option.value] = response[option.value];
    });

    setFilteredData(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          BFHL Challenge
        </h1>

        {/* Input Section */}
        <textarea
          rows={6}
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON, e.g., {"data":["A","1","z"]}'
          className="w-full p-4 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {error && (
          <p className="mt-4 text-red-600 text-sm bg-red-100 p-2 rounded">
            {error}
          </p>
        )}
      </div>

      {/* Display Raw Response */}
      {response && (
        <div className="max-w-2xl w-full text-black bg-white shadow-lg rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Raw Response
          </h3>
          <div className="bg-gray-100 text-black p-4 rounded-lg">
            <pre className="text-sm text-gray-800 overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Dropdown Section */}
      {response && (
        <div className="max-w-2xl w-full text-black bg-white shadow-lg rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Filter Response
          </h3>

          <Select
            isMulti
            options={options}
            onChange={(newValue) => {
              setSelectedOptions(newValue as any[]);
              setFilteredData(null); // Reset filtered data on dropdown change
            }}
            placeholder="Select fields to display"
            className="mb-4"
          />

          <button
            onClick={applyFilter}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Filter
          </button>

          {/* Filtered Response */}
          {filteredData && (
            <div className="bg-gray-100 text-black p-4 rounded-lg mt-4">
              <h4 className="text-lg font-semibold mb-2 text-gray-700">
                Filtered Response
              </h4>
              <pre className="text-sm text-gray-800 overflow-x-auto">
                {JSON.stringify(filteredData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
