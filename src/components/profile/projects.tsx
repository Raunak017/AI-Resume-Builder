'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, X } from 'lucide-react';
import { fetchGeneratedBullets, fetchEnhancedBullet } from '@/lib/api';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { Database } from '@/types/supabase';

type ProjectFromDB = Database['public']['Tables']['projects']['Row'];

type Project = {
  id?: number;
  name: string;
  link: string;
  startdate: string;
  enddate: string;
  description: string[];
  profileid?: string;
  created_at?: string;
  suggestions: string[];
  showSuggestions: boolean;
};

type StringOnlyFields = 'name' | 'link' | 'startdate' | 'enddate';

export default function ProjectSection({ user }: { user: User | null }) {
  const supabase = createClientComponentClient();
  const [projects, setProjects] = useState<Project[]>([]);

  const [summaryErrors, setSummaryErrors] = useState<Record<number, boolean>>({});
  const [bulletErrors, setBulletErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('profileid', user.id);

      if (error) {
        toast.error('Failed to load projects');
      } else {
        setProjects(
          data.map((proj) => ({
            ...proj,
            suggestions: [],
            showSuggestions: true,
          }))
        );
      }
    };

    fetchProjects();
  }, [user]);

  const handleProjectChange = (
    index: number,
    field: StringOnlyFields,
    value: string
  ) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };

  const handleBulletChange = (projIndex: number, bulletIndex: number, value: string) => {
    const updated = [...projects];
    updated[projIndex].description[bulletIndex] = value;
    setProjects(updated);

    const key = `${projIndex}-${bulletIndex}`;
    if (value.trim()) {
      setBulletErrors((prev) => ({ ...prev, [key]: false }));
    }
  };

  const addBulletPoint = (projIndex: number) => {
    const updated = [...projects];
    updated[projIndex].description.push('');
    setProjects(updated);
  };

  const deleteBullet = (projIdx: number, bulletIdx: number) => {
    const updated = [...projects];
    updated[projIdx].description.splice(bulletIdx, 1);
    setProjects(updated);
  };

  const addProject = () =>
    setProjects([
      ...projects,
      {
        name: '',
        link: '',
        startdate: '',
        enddate: '',
        description: [''],
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
    const summary = projects[projIdx].name.trim();
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
    const bullet = projects[projIdx].description[bulletIdx].trim();
    const key = `${projIdx}-${bulletIdx}`;

    if (!bullet) {
      setBulletErrors((prev) => ({ ...prev, [key]: true }));
      return;
    }

    setBulletErrors((prev) => ({ ...prev, [key]: false }));

    const enhanced = (await fetchEnhancedBullet(bullet)).replace(/^"+|"+$/g, '');
    const updated = [...projects];
    updated[projIdx].description[bulletIdx] = enhanced;
    setProjects(updated);
  };

  const toggleSuggestion = (projIdx: number, suggestion: string) => {
    const updated = [...projects];
    const proj = updated[projIdx];
    const list = proj.description;

    if (list.includes(suggestion)) {
      proj.description = list.filter((s) => s !== suggestion);
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

  const saveProjects = async () => {
    if (!user) return;

    await supabase.from('projects').delete().eq('profileid', user.id);

    const inserts = projects.map((proj) => ({
      name: proj.name,
      link: proj.link,
      startdate: proj.startdate,
      enddate: proj.enddate,
      description: proj.description,
      profileid: user.id,
    }));

    const { error } = await supabase.from('projects').insert(inserts);
    if (error) {
      toast.error('Failed to save projects');
    } else {
      toast.success('Projects saved successfully!');
    }
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
            />
          </div>

          <div className="space-y-2">
            <Label>Project Link (optional)</Label>
            <Input
              value={proj.link}
              onChange={(e) => handleProjectChange(projIndex, 'link', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={proj.startdate}
                onChange={(e) => handleProjectChange(projIndex, 'startdate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                value={proj.enddate}
                onChange={(e) => handleProjectChange(projIndex, 'enddate', e.target.value)}
              />
            </div>
          </div>

          <Button variant="secondary" onClick={() => generateBullets(projIndex)}>
            ✨ Generate Bullet Points
          </Button>

          <div className="space-y-2">
            <Label>Bullet Points</Label>
            {proj.description.map((bullet, bulletIndex) => (
              <div key={bulletIndex} className="flex items-start gap-2 w-full">
                <div className="flex-1">
                  <Textarea
                    className="min-h-[60px] w-full"
                    value={bullet}
                    onChange={(e) => handleBulletChange(projIndex, bulletIndex, e.target.value)}
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
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => addBulletPoint(projIndex)}>
              Add Bullet Point
            </Button>
          </div>

          {proj.showSuggestions && proj.suggestions.length > 0 && (
            <div className="space-y-2 border-t pt-4 relative">
              <button
                className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                onClick={() => hideSuggestions(projIndex)}
              >
                <X size={14} />
              </button>

              <Label>Suggestions (click to add/remove)</Label>
              {proj.suggestions.map((s, i) => (
                <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={proj.description.includes(s)}
                    onChange={() => toggleSuggestion(projIndex, s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Button type="button" variant="default" onClick={addProject}>
          Add Another Project
        </Button>
        <Button type="button" variant="secondary" onClick={saveProjects}>
          Save All Projects
        </Button>
      </div>
    </div>
  );
}