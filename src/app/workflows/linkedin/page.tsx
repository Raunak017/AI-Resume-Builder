"use client";

import { useState, useEffect } from "react";

type LinkedInProfile = {
  id: string;
  name: string;
  title: string;
  url: string;
};

export default function LinkedInWorkflow() {
  const [profileUrl, setProfileUrl] = useState("");
  const [importedProfiles, setImportedProfiles] = useState<LinkedInProfile[]>(
    []
  );

  const handleImport = async () => {
    if (!profileUrl) return alert("Enter a LinkedIn profile URL.");

    const res = await fetch("/api/upload-linkedin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: profileUrl }),
    });

    const result = await res.json();
    if (res.ok) {
      setImportedProfiles((prev) => [...prev, result.profile]);
      setProfileUrl("");
      alert("LinkedIn profile imported!");
    } else {
      alert(result.error || "Import failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this LinkedIn profile?")) return;

    const res = await fetch(`/api/upload-linkedin?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setImportedProfiles((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Import LinkedIn Profile</h1>

      <div className="flex gap-2 items-center">
        <input
          type="url"
          placeholder="https://linkedin.com/in/username"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleImport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Import
        </button>
      </div>

      <ul className="space-y-2">
        {importedProfiles.map((profile) => (
          <li
            key={profile.id}
            className="bg-gray-100 px-4 py-2 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{profile.name}</p>
              <p className="text-sm text-gray-600">{profile.title}</p>
              <a
                href={profile.url}
                className="text-blue-600 text-sm"
                target="_blank"
              >
                View on LinkedIn
              </a>
            </div>
            <button
              onClick={() => handleDelete(profile.id)}
              className="text-red-600 font-bold text-xl"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
