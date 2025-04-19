"use client";

import { useEffect, useState } from "react";

type UploadedFile = {
  id: string;
  name: string;
};

export default function PDFWorkflow() {
  const [data, setData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

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

    if (res.ok) {
      alert("File uploaded.");
      setUploadedFiles((prev) => [
        ...prev,
        { id: result.id, name: result.fileName },
      ]);
      setFile(null);
    } else {
      alert("Upload failed.");
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    const confirmDelete = confirm(`Delete "${file.name}"?`);
    if (!confirmDelete) return;

    const res = await fetch(`/api/upload-pdf?id=${file.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== file.id));
      alert(`"${file.name}" deleted.`);
    } else {
      alert("Failed to delete.");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
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

      {/* File Upload UI */}
      <div className="space-y-4">
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

        <button
          onClick={handleFileUpload}
          disabled={!file}
          className={`px-4 py-2 rounded ${
            file
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Upload PDF
        </button>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Uploaded Files</h2>
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li
                key={file.id}
                className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded"
              >
                <button
                  onClick={() =>
                    window.open(`/api/upload-pdf?id=${file.id}`, "_blank")
                  }
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  View "{file.name}"
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-500 hover:text-red-700 text-xl font-bold"
                  aria-label={`Delete ${file.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
