"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UploadedFile = {
  id: string;
  name: string;
};

export default function ParseResumePage() {
  const [pdfs, setPdfs] = useState<UploadedFile[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/upload-pdf?list=true")
      .then((res) => res.json())
      .then(setPdfs);
  }, []);

  const handleParse = () => {
    if (!selected) {
      alert("Select a PDF to parse.");
      return;
    }

    // Navigate to parser step with file ID in query
    router.push(`/workflows/parse/${selected}`);
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Select Resume PDF to Parse</h1>

      <div className="space-y-3">
        <select
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          defaultValue=""
        >
          <option value="" disabled>
            Select a PDF
          </option>
          {pdfs.map((pdf) => (
            <option key={pdf.id} value={pdf.id}>
              {pdf.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleParse}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Parse Selected PDF
        </button>
      </div>
    </main>
  );
}
