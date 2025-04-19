"use client";

import { useEffect, useState } from "react";

export default function PDFWorkflow() {
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/temp-store")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const handleFileUpload = async () => {
    if (!file) return alert("No file selected.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-pdf", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    console.log("Uploaded file info:", result);

    if (res.ok) {
      alert("File uploaded and stored temporarily.");
    } else {
      alert("File upload failed.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">PDF Upload Workflow</h1>

      {/* Temp form data from /upload */}
      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <p>
            <strong>Expiry:</strong> {data.expiry}
          </p>
          <p>
            <strong>Shared With:</strong> {data.sharedUsers?.join(", ")}
          </p>
          <p>
            <strong>Import Method:</strong> {data.importMethod}
          </p>
        </div>
      )}

      {/* Upload UI */}
      <div className="space-y-4">
        {/* Styled file input */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Choose PDF File
          </label>
          <span className="text-sm text-gray-700">
            {file?.name || "No file chosen"}
          </span>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleFileUpload}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Upload PDF
        </button>

        {/* Open in new tab */}
        <button
          onClick={() => window.open("/api/upload-pdf", "_blank")}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          View Uploaded PDF
        </button>
      </div>
    </main>
  );
}
