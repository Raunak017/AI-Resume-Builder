"use client";

import { useEffect, useState } from "react";

type ResumeTemplate = {
  fileId: string;
  fileName: string;
  versionIndex: number;
  createdAt: string;
  html: string;
};

export default function ResumeListPage() {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/upload-pdf?list=true");
        if (!res.ok) throw new Error("Failed to load files.");
        const files = await res.json();

        const all: ResumeTemplate[] = [];

        for (const file of files) {
          const metaRes = await fetch(`/api/resume-metadata?id=${file.id}`);
          if (!metaRes.ok) continue;
          const meta = await metaRes.json();

          const templates = meta.templates || [];
          for (const t of templates) {
            all.push({
              fileId: file.id,
              fileName: file.name,
              versionIndex: t.versionIndex,
              createdAt: t.createdAt,
              html: t.html,
            });
          }
        }

        setTemplates(all);
      } catch (err) {
        console.error("❌ Error loading resume templates:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Saved Resumes</h1>

      {loading ? (
        <p className="text-gray-500">Loading templates...</p>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">No saved resumes yet.</p>
      ) : (
        <ul className="space-y-6">
          {templates.map((tpl, i) => (
            <li key={i} className="bg-white rounded shadow p-4 border">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  {tpl.fileName} – Version {tpl.versionIndex + 1}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(tpl.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="overflow-auto max-h-96 border border-gray-200 rounded p-3 bg-gray-50 text-sm">
                <div dangerouslySetInnerHTML={{ __html: tpl.html }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
