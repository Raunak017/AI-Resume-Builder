"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ViewMutatedPage() {
  const [loading, setLoading] = useState(true);
  const [mutations, setMutations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/resume-metadata?id=${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch mutations.");
        }

        let data;
        try {
          data = await res.json();
        } catch (err) {
          console.error("❌ Failed to parse JSON:", err);
          setError("Could not read mutation data.");
          setLoading(false);
          return;
        }

        if (!data.mutatedData || data.mutatedData.length === 0) {
          setError("No mutated resumes available.");
        } else {
          setMutations(data.mutatedData);
        }
      } catch (err: any) {
        console.error("❌ Error fetching mutations:", err);
        setError(err.message || "Unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Mutated Resume Versions</h1>

      {loading && <p className="text-gray-500">Loading mutations...</p>}
      {error && !loading && <p className="text-red-600">{error}</p>}

      {!loading && !error && mutations.length > 0 && (
        <div className="space-y-6">
          {mutations.map((version, i) => (
            <div
              key={i}
              className="bg-white shadow p-4 rounded border border-gray-300"
            >
              <h2 className="text-lg font-semibold mb-2">Version {i + 1}</h2>
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words">
                {JSON.stringify(version, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div>
        <button
          onClick={() => (window.location.href = "/pdflist")}
          className="mt-4 text-blue-600 underline"
        >
          ← Back to PDF list
        </button>
      </div>
    </main>
  );
}
