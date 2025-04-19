// src/app/workflows/pdf/page.tsx

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
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">PDF Upload Workflow</h1>

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

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleFileUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload PDF
      </button>
    </main>
  );
}
