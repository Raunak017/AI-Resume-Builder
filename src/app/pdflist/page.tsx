"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UploadedFile = {
  id: string;
  name: string;
  parsed: boolean;
  mutated: boolean;
};

export default function PDFListPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [parsingId, setParsingId] = useState<string | null>(null);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const router = useRouter();

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

  const handleParse = async (file: UploadedFile) => {
    setParsingId(file.id);
    try {
      const res = await fetch(`/api/parse-resume?id=${file.id}`);
      if (!res.ok) {
        alert("Parsing failed.");
        return;
      }

      router.push(`/workflows/parse/${file.id}`);
    } finally {
      setParsingId(null);
    }
  };

  const handleMutate = async (file: UploadedFile) => {
    setMutatingId(file.id);
    try {
      const res = await fetch(`/api/mutate-resume?id=${file.id}`);
      if (!res.ok) {
        alert("Mutation failed.");
        return;
      }

      router.push(`/workflows/mutate/${file.id}`);
    } finally {
      setMutatingId(null);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">All Uploaded PDFs</h1>

      {files.length === 0 ? (
        <p className="text-gray-500">No PDFs found.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 p-4 rounded shadow"
            >
              <span className="font-medium mb-2 sm:mb-0">{file.name}</span>

              <div className="flex flex-wrap gap-2">
                {/* View PDF */}
                <button
                  onClick={() =>
                    window.open(`/api/upload-pdf?id=${file.id}`, "_blank")
                  }
                  className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
                >
                  View PDF
                </button>

                {/* Parse / View Parsed */}
                <button
                  onClick={() =>
                    file.parsed
                      ? router.push(`/workflows/parse/${file.id}`)
                      : handleParse(file)
                  }
                  disabled={parsingId === file.id}
                  className={`px-3 py-1 rounded text-white ${
                    parsingId === file.id
                      ? "bg-yellow-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {parsingId === file.id
                    ? "Parsing..."
                    : file.parsed
                      ? "View Parsed"
                      : "Parse"}
                </button>

                {/* Mutate / View Mutated */}
                <button
                  onClick={() =>
                    file.mutated
                      ? router.push(`/workflows/mutate/${file.id}`)
                      : handleMutate(file)
                  }
                  disabled={mutatingId === file.id}
                  className={`px-3 py-1 rounded text-white ${
                    mutatingId === file.id
                      ? "bg-yellow-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {mutatingId === file.id
                    ? "Mutating..."
                    : file.mutated
                      ? "View Mutated"
                      : "Mutate"}
                </button>

                {/* ✨ Template Builder */}
                {file.mutated && (
                  <button
                    onClick={() => router.push(`/resume_template/${file.id}`)}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  >
                    Build Resume
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(file)}
                  className="text-red-600 hover:text-red-800 text-xl font-bold ml-2"
                  title="Delete PDF"
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
