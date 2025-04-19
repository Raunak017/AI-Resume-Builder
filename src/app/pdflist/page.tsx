"use client";

import { useEffect, useState } from "react";

type UploadedFile = {
  id: string;
  name: string;
};

export default function PDFListPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const fetchFiles = async () => {
    const res = await fetch("/api/upload-pdf?list=true");
    if (res.ok) {
      const data = await res.json();
      setFiles(data);
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    const confirmed = confirm(`Delete "${file.name}"?`);
    if (!confirmed) return;

    const res = await fetch(`/api/upload-pdf?id=${file.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      alert(`"${file.name}" deleted.`);
    } else {
      alert("Failed to delete file.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">All Uploaded PDFs</h1>

      {files.length === 0 ? (
        <p className="text-gray-500">No PDFs found.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
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
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
