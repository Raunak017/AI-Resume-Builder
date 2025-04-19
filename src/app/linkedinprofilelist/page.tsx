"use client";

import { useEffect, useState } from "react";

type LinkedInProfile = {
  id: string;
  name: string;
  title: string;
  url: string;
};

export default function LinkedInListPage() {
  const [profiles, setProfiles] = useState<LinkedInProfile[]>([]);

  const fetchProfiles = async () => {
    const res = await fetch("/api/upload-linkedin");
    const data = await res.json();
    setProfiles(data);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/upload-linkedin?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">LinkedIn Profiles</h1>

      {profiles.length === 0 ? (
        <p className="text-gray-500">No LinkedIn profiles stored.</p>
      ) : (
        <ul className="space-y-2">
          {profiles.map((profile) => (
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
      )}
    </main>
  );
}
