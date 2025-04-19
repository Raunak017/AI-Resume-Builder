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
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="bg-gray-100 px-4 py-3 rounded flex flex-wrap justify-between items-center gap-3"
            >
              <div className="text-sm font-medium">{file.name}</div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    window.open(`/api/upload-pdf?id=${file.id}`, "_blank")
                  }
                  className="bg-gray-700 text-white px-4 py-1.5 rounded hover:bg-gray-800 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `/workflows/parse/${file.id}`)
                  }
                  className="bg-purple-600 text-white px-4 py-1.5 rounded hover:bg-purple-700 text-sm"
                >
                  Parse
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:text-red-800 text-xl font-bold px-2"
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
