'use client';

import { useState } from 'react';
import {
  fetchGeneratedBullets,
  fetchEnhancedBullet,
  fetchMoreBullets,
} from '@/lib/api';

export default function BuilderForm() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);
  const [selectedBullets, setSelectedBullets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const results = await fetchGeneratedBullets(summary, 4);
    setBullets(results);
    setLoading(false);
  };

  const handleEnhance = async (bullet: string) => {
    setEnhancing(bullet);
    const enhanced = await fetchEnhancedBullet(bullet);
    setBullets((prev) =>
      prev.map((b) => (b === bullet ? enhanced : b))
    );
    setEnhancing(null);
  };

  const handleGenerateMore = async () => {
    setLoading(true);
    const more = await fetchMoreBullets(bullets, summary);
    setBullets((prev) => [...prev, ...more]);
    setLoading(false);
  };

  const toggleSelect = (bullet: string) => {
    setSelectedBullets((prev) =>
      prev.includes(bullet)
        ? prev.filter((b) => b !== bullet)
        : [...prev, bullet]
    );
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Fields */}
      <div className="grid grid-cols-2 gap-4">
        <input
          placeholder="Company"
          className="border p-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Role"
          className="border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          placeholder="Location"
          className="border p-2 col-span-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Summary Input */}
      <textarea
        rows={4}
        placeholder="Describe your work or responsibilities here..."
        className="border p-2 w-full"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : '✨ Generate Bullet Points'}
      </button>

      {/* Bullet Point Results */}
      {bullets.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-medium text-lg">Select Bullet Points</h3>
          {bullets.map((b, i) => (
            <div
              key={i}
              className="flex flex-col gap-1 bg-gray-100 p-3 rounded"
            >
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedBullets.includes(b)}
                  onChange={() => toggleSelect(b)}
                />
                <span className="flex-1 text-sm">{b}</span>
              </div>
              <button
                onClick={() => handleEnhance(b)}
                disabled={enhancing === b}
                className="text-xs text-blue-500 hover:underline ml-6"
              >
                {enhancing === b ? 'Enhancing...' : '✨ Enhance'}
              </button>
            </div>
          ))}

          {/* Generate More */}
          <button
            onClick={handleGenerateMore}
            className="mt-3 text-sm text-green-600 hover:underline"
          >
            ➕ Generate More Bullet Points
          </button>
        </div>
      )}

      {/* Final Preview */}
      {selectedBullets.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Final Selected Bullet Points</h3>
          <ul className="list-disc pl-5 text-sm text-gray-800">
            {selectedBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}