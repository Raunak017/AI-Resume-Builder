"use client";
import { useState } from "react";

interface Props {
  sharedUsers: string[];
  setSharedUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Step2_Sharing({ sharedUsers, setSharedUsers }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = () => {
    // mock: replace with real API
    setSuggestions(
      ["john_doe", "jane_admin", "dev_sam", "me"].filter((u) =>
        u.includes(searchTerm)
      )
    );
  };

  const toggleUser = (username: string) => {
    setSharedUsers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  const removeUser = (username: string) => {
    setSharedUsers((prev) => prev.filter((u) => u !== username));
  };

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">2. Share Data With Users</h2>

      {/* ✅ Selected Users Display */}
      {sharedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {sharedUsers.map((user) => (
            <span
              key={user}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {user}
              <button
                onClick={() => removeUser(user)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 🔍 Search + Input */}
      <div className="flex gap-2">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search by username"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* 📋 Suggestions */}
      <div className="mt-3 space-y-1">
        {suggestions.map((user) => (
          <label key={user} className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={sharedUsers.includes(user)}
              onChange={() => toggleUser(user)}
            />
            <span>{user}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
