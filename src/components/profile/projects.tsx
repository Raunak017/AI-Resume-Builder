'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, X } from 'lucide-react';

import {
  fetchGeneratedBullets,
  fetchEnhancedBullet,
} from '@/lib/api';

type Project = {
  name: string;
  from: string;
  to: string;
  summary: string;
  bullets: string[];
  suggestions: string[];
  showSuggestions: boolean;
};

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([
    { name: '', from: '', to: '', summary: '', bullets: [''], suggestions: [], showSuggestions: true },
  ]);

  const [summaryErrors, setSummaryErrors] = useState<Record<number, boolean>>({});
  const [bulletErrors, setBulletErrors] = useState<Record<string, boolean>>({});

  type StringOnlyFields = Exclude<keyof Project, 'bullets' | 'suggestions' | 'showSuggestions'>;

  const handleProjectChange = (
    index: number,
    field: StringOnlyFields,
    value: string
  ) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleBulletChange = (
    projIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const updated = [...projects];
    updated[projIndex].bullets[bulletIndex] = value;
    setProjects(updated);

    const key = `${projIndex}-${bulletIndex}`;
    if (value.trim()) {
      setBulletErrors(prev => ({ ...prev, [key]: false }));
    }
  };

  const addBulletPoint = (projIndex: number) => {
    const updated = [...projects];
    updated[projIndex].bullets.push('');
    setProjects(updated);
  };

  const deleteBullet = (projIdx: number, bulletIdx: number) => {
    const updated = [...projects];
    updated[projIdx].bullets.splice(bulletIdx, 1);
    setProjects(updated);
  };

  const addProject = () =>
    setProjects([
      ...projects,
      {
        name: '',
        from: '',
        to: '',
        summary: '',
        bullets: [''],
        suggestions: [],
        showSuggestions: true,
      },
    ]);

  const deleteProject = (projIndex: number) => {
    const updated = [...projects];
    updated.splice(projIndex, 1);
    setProjects(updated);
  };

  const generateBullets = async (projIdx: number) => {
    const summary = projects[projIdx].summary.trim();
    if (!summary) {
      setSummaryErrors((prev) => ({ ...prev, [projIdx]: true }));
      return;
    }

    setSummaryErrors((prev) => ({ ...prev, [projIdx]: false }));

    const ideas = await fetchGeneratedBullets(summary, 4);
    const updated = [...projects];
    updated[projIdx].suggestions = ideas;
    updated[projIdx].showSuggestions = true;
    setProjects(updated);
  };

  const enhanceBullet = async (projIdx: number, bulletIdx: number) => {
    const bullet = projects[projIdx].bullets[bulletIdx].trim();
    const key = `${projIdx}-${bulletIdx}`;

    if (!bullet) {
      setBulletErrors((prev) => ({ ...prev, [key]: true }));
      return;
    }

    setBulletErrors((prev) => ({ ...prev, [key]: false }));

    const enhanced = (await fetchEnhancedBullet(bullet)).replace(/^"+|"+$/g, '');
    const updated = [...projects];
    updated[projIdx].bullets[bulletIdx] = enhanced;
    setProjects(updated);
  };

  const toggleSuggestion = (projIdx: number, suggestion: string) => {
    const updated = [...projects];
    const proj = updated[projIdx];
    const list = proj.bullets;

    if (list.includes(suggestion)) {
      proj.bullets = list.filter((s) => s !== suggestion);
    } else {
      list.push(suggestion);
    }

    setProjects(updated);
  };

  const hideSuggestions = (projIdx: number) => {
    const updated = [...projects];
    updated[projIdx].showSuggestions = false;
    setProjects(updated);
  };

  return (
    <div className="space-y-6">
      <Label className="text-lg font-semibold">Projects</Label>

      {projects.map((proj, projIndex) => (
        <div key={projIndex} className="relative space-y-4 border p-4 rounded-md">
          {projects.length > 1 && (
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              onClick={() => deleteProject(projIndex)}
              aria-label="Delete project"
            >
              <X size={16} />
            </button>
          )}

          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={proj.name}
              onChange={(e) => handleProjectChange(projIndex, 'name', e.target.value)}
              placeholder="e.g., Real-Time Collaboration App"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From (MM YYYY)</Label>
              <Input
                value={proj.from}
                onChange={(e) => handleProjectChange(projIndex, 'from', e.target.value)}
                placeholder="e.g., 04 2023"
              />
            </div>
            <div className="space-y-2">
              <Label>To (MM YYYY)</Label>
              <Input
                value={proj.to}
                onChange={(e) => handleProjectChange(projIndex, 'to', e.target.value)}
                placeholder="e.g., 12 2023"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Project Summary</Label>
            <Textarea
              rows={3}
              value={proj.summary}
              onChange={(e) => handleProjectChange(projIndex, 'summary', e.target.value)}
              placeholder="Describe what this project was about..."
            />
            {summaryErrors[projIndex] && (
              <p className="text-red-500 text-xs mt-1">
                Project summary is required to generate bullet points.
              </p>
            )}
            <Button
              variant="secondary"
              type="button"
              onClick={() => generateBullets(projIndex)}
            >
              ✨ Generate Bullet Points
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Bullet Points</Label>
            {proj.bullets.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex items-start gap-2 w-full">
                <div className="flex-1">
                  <Textarea
                    className="min-h-[60px] w-full"
                    value={bullet}
                    onChange={(e) =>
                      handleBulletChange(projIndex, bulletIndex, e.target.value)
                    }
                    placeholder={`Description bullet #${bulletIndex + 1}`}
                  />
                  {bulletErrors[`${projIndex}-${bulletIndex}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      This field is required to use ✨ Enhance.
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => enhanceBullet(projIndex, bulletIndex)}
                  >
                    ✨
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => deleteBullet(projIndex, bulletIndex)}
                    aria-label="Delete bullet"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addBulletPoint(projIndex)}
            >
              Add Bullet Point
            </Button>
          </div>

          {proj.showSuggestions && proj.suggestions.length > 0 && (
            <div className="space-y-2 border-t pt-4 relative">
              <button
                className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                onClick={() => hideSuggestions(projIndex)}
                aria-label="Hide suggestions"
              >
                <X size={14} />
              </button>

              <Label>Suggestions (click to add/remove)</Label>
              {proj.suggestions.map((s, i) => (
                <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={proj.bullets.includes(s)}
                    onChange={() => toggleSuggestion(projIndex, s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="default" onClick={addProject}>
        Add Another Project
      </Button>
    </div>
  );
}