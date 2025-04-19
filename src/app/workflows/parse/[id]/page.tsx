"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Resume = {
  name: string;
  contact: {
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  skills: string[];
  experience: {
    company: string;
    title: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    duration: string;
  }[];
  projects: {
    title: string;
    tech: string[];
    description: string;
  }[];
};

export default function ParsedResumePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<Resume | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseResume = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/parse-resume?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setResume(data);
        } else {
          setError(data.error || "Failed to parse PDF.");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (id) parseResume();
  }, [id]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Parsed Resume</h1>

      {loading && <p>Parsing PDF...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {resume && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(resume, null, 2)}
        </pre>
      )}
    </main>
  );
}
