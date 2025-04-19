'use client'

import { useState } from 'react'
import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button }   from '@/components/ui/button'
import { X, Trash2 } from 'lucide-react'

import {
  fetchGeneratedBullets,
  fetchEnhancedBullet,
} from '@/lib/api'

/* ---------- data shapes ---------- */

type Job = {
  company: string
  role: string
  location: string
  from: string
  to: string
  currently: boolean
  summary: string
  bullets: string[]
  suggestions: string[]
  showSuggestions: boolean
}

type TextField =
  | 'company'
  | 'role'
  | 'location'
  | 'from'
  | 'to'
  | 'summary'

/* ---------- component ---------- */

export default function WorkExSection() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      company: '',
      role: '',
      location: '',
      from: '',
      to: '',
      currently: false,
      summary: '',
      bullets: [''],
      suggestions: [],
      showSuggestions: true,
    },
  ])
  /* error messages for no text in fields */
  const [bulletErrors, setBulletErrors] = useState<Record<string, boolean>>({});
  const [summaryErrors, setSummaryErrors] = useState<Record<number, boolean>>({});

  /* immutable update helper */
  const mutate = (fn: (draft: Job[]) => void) =>
    setJobs(prev => {
      const next = structuredClone(prev) as Job[]
      fn(next)
      return next
    })

  /* ----- field handlers ----- */

  const handleText =
    (idx: number, field: TextField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      mutate(d => {
        d[idx][field] = e.target.value
      })

  const toggleCurrently = (idx: number) =>
    mutate(d => {
      const job = d[idx]
      job.currently = !job.currently
      if (job.currently) job.to = ''
    })

  const handleBullet =
    (jobIdx: number, bulletIdx: number) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      mutate(d => {
        d[jobIdx].bullets[bulletIdx] = e.target.value
      })

  /* ----- list actions ----- */

  const addBullet = (idx: number) =>
    mutate(d => {
      d[idx].bullets.push('')
    })

  const deleteBullet = (jobIdx: number, bulletIdx: number) =>
    mutate(d => {
      d[jobIdx].bullets.splice(bulletIdx, 1)
    })

  const addJob = () =>
    mutate(d => {
      d.push({
        company: '',
        role: '',
        location: '',
        from: '',
        to: '',
        currently: false,
        summary: '',
        bullets: [''],
        suggestions: [],
        showSuggestions: true,
      })
    })

  const deleteJob = (idx: number) =>
    mutate(d => {
      d.splice(idx, 1)
    })

  /* ----- AI helpers ----- */

  const enhanceBullet = async (jobIdx: number, bulletIdx: number) => {
    const bullet = jobs[jobIdx].bullets[bulletIdx].trim();
    const key = `${jobIdx}-${bulletIdx}`;
  
    if (!bullet) {
      setBulletErrors(prev => ({ ...prev, [key]: true }));
      return;
    }
  
    setBulletErrors(prev => ({ ...prev, [key]: false })); // clear error if valid
  
    const upgraded = (await fetchEnhancedBullet(bullet)).replace(/^"+|"+$/g, '');
    mutate(d => {
      d[jobIdx].bullets[bulletIdx] = upgraded;
    });
  };

  const generateBullets = async (jobIdx: number) => {
    const summary = jobs[jobIdx].summary.trim();
    if (!summary) {
      setSummaryErrors((prev) => ({ ...prev, [jobIdx]: true }));
      return;
    }
  
    setSummaryErrors((prev) => ({ ...prev, [jobIdx]: false }));
  
    const ideas = await fetchGeneratedBullets(summary, 4);
    mutate((d) => {
      d[jobIdx].suggestions = ideas;
      d[jobIdx].showSuggestions = true;
    });
  };

  const toggleSuggestion = (jobIdx: number, suggestion: string) =>
    mutate(d => {
      const list = d[jobIdx].bullets
      if (list.includes(suggestion)) {
        d[jobIdx].bullets = list.filter(s => s !== suggestion)
      } else {
        list.push(suggestion)
      }
    })

  const hideSuggestions = (idx: number) =>
    mutate(d => {
      d[idx].showSuggestions = false
    })

  /* ---------- render ---------- */

  return (
    <div className="space-y-6">
      <Label className="text-lg font-semibold">Work Experience</Label>

      {jobs.map((job, idx) => (
        <div key={idx} className="relative space-y-6 border p-4 rounded-md">
          {/* delete job */}
          {jobs.length > 1 && (
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              onClick={() => deleteJob(idx)}
              aria-label="Delete job"
            >
              <X size={16} />
            </button>
          )}

          {/* basic fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={job.company} onChange={handleText(idx, 'company')} />
            </div>
            <div className="space-y-2">
              <Label>Role / Title</Label>
              <Input value={job.role} onChange={handleText(idx, 'role')} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Location</Label>
              <Input value={job.location} onChange={handleText(idx, 'location')} />
            </div>
          </div>

          {/* dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From (MM YYYY)</Label>
              <Input value={job.from} onChange={handleText(idx, 'from')} placeholder="e.g., 01 2022" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>To (MM YYYY)</Label>
                <div className="flex items-center gap-1 text-xs">
                  <input
                    id={`cur-${idx}`}
                    type="checkbox"
                    checked={job.currently}
                    onChange={() => toggleCurrently(idx)}
                  />
                  <label htmlFor={`cur-${idx}`}>Current</label>
                </div>
              </div>
              <Input
                value={job.to}
                onChange={handleText(idx, 'to')}
                placeholder="e.g., 06 2024"
                disabled={job.currently}
              />
            </div>
          </div>

          {/* summary */}
          <div className="space-y-2">
            <Label>Role summary</Label>
            <Textarea
              rows={3}
              value={job.summary}
              onChange={handleText(idx, 'summary')}
              placeholder="Describe your work or responsibilities…"
            />
            {summaryErrors[idx] && (
                <p className="text-red-500 text-xs mt-1">
                    Role summary is required to generate bullet points.
                </p>
                )}
          </div>

          <Button variant="secondary" onClick={() => generateBullets(idx)}>
            ✨ Generate Bullet Points
          </Button>

          {/* bullets */}
          <div className="space-y-2">
            <div>
                <Label>Bullet Points</Label>
                {/* <p className="text-xs text-muted-foreground">
                Tell us what you worked on and we'll write it for you. Click ✨ to enhance.
                </p> */}
            </div>

            {job.bullets.map((b, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2 w-full">
                    <div className="flex-1">
                    <Textarea
                        className="min-h-[60px] w-full"
                        value={b}
                        onChange={handleBullet(idx, bIdx)}
                        placeholder="Tell us what you worked on and we'll enhance it for you"
                    />
                    {bulletErrors[`${idx}-${bIdx}`] && (
                        <p className="text-red-500 text-xs mt-1">
                        This field is required to use ✨ Enhance.
                        </p>
                    )}
                    </div>
                    <div className="flex flex-col gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => enhanceBullet(idx, bIdx)}
                    >
                        ✨
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => deleteBullet(idx, bIdx)}
                        aria-label="Delete bullet"
                    >
                        <Trash2 size={14} />
                    </Button>
                    </div>
                </div>
))}

        <Button size="sm" variant="outline" onClick={() => addBullet(idx)}>
            Add Bullet Point
        </Button>
          </div>

          {/* suggestions */}
          {job.showSuggestions && job.suggestions.length > 0 && (
            <div className="space-y-2 border-t pt-4 relative">
              <button
                className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                onClick={() => hideSuggestions(idx)}
                aria-label="Hide suggestions"
              >
                <X size={14} />
              </button>

              <Label>Suggestions (click to add/remove)</Label>
              {job.suggestions.map((s, i) => (
                <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={job.bullets.includes(s)}
                    onChange={() => toggleSuggestion(idx, s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <Button variant="default" onClick={addJob}>
        Add Another Job
      </Button>
    </div>
  )
}