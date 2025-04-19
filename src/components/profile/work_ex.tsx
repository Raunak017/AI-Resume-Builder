'use client'

import { useState } from 'react'
import { Label }    from '@/components/ui/label'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button }   from '@/components/ui/button'

import {
  fetchGeneratedBullets,
  fetchEnhancedBullet,
  fetchMoreBullets,
} from '@/lib/api'

/* ---------- data shapes ---------- */

type Job = {
  company: string
  role: string
  location: string
  summary: string
  bullets: string[]
  suggestions: string[]
}

type TextField = 'company' | 'role' | 'location' | 'summary'

/* ---------- component ---------- */

export default function WorkExSection() {
  const [jobs, setJobs] = useState<Job[]>([
    { company: '', role: '', location: '', summary: '', bullets: [''], suggestions: [] },
  ])

  /* immutable update helper */
  const mutate = (fn: (draft: Job[]) => void) =>
    setJobs(prev => {
      const next = structuredClone(prev) as Job[]
      fn(next)
      return next
    })

  /* ----- handlers ----- */

  const handleTextField =
    (idx: number, field: TextField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      mutate(d => {
        d[idx][field] = e.target.value
      })

  const handleBulletChange =
    (jobIdx: number, bulletIdx: number) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      mutate(d => {
        d[jobIdx].bullets[bulletIdx] = e.target.value
      })

  const addBullet = (jobIdx: number) =>
    mutate(d => {
      d[jobIdx].bullets.push('')
    })

  const addJob = () =>
    mutate(d => {
      d.push({
        company: '',
        role: '',
        location: '',
        summary: '',
        bullets: [''],
        suggestions: [],
      })
    })

  const enhanceBullet = async (jobIdx: number, bulletIdx: number) => {
    const original = jobs[jobIdx].bullets[bulletIdx].trim()
    if (!original) return
    const upgraded = await fetchEnhancedBullet(original)
    mutate(d => {
      d[jobIdx].bullets[bulletIdx] = upgraded
    })
  }

  const generateBullets = async (jobIdx: number) => {
    const keywords = prompt('Keywords / accomplishments to emphasise?')
    if (keywords === null || !keywords.trim()) return
    const ideas = await fetchGeneratedBullets(keywords, 4)
    mutate(d => {
      d[jobIdx].suggestions = ideas
    })
  }

  const toggleSuggestion = (jobIdx: number, suggestion: string) =>
    mutate(d => {
      const list = d[jobIdx].bullets
      if (list.includes(suggestion)) {
        d[jobIdx].bullets = list.filter(s => s !== suggestion)
      } else {
        list.push(suggestion)
      }
    })

  /* ----- render ----- */

  return (
    <div className="space-y-6">
      <Label className="text-lg font-semibold">Work Experience</Label>

      {jobs.map((job, idx) => (
        <div key={idx} className="space-y-6 border p-4 rounded-md">
          {/* basic fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={job.company} onChange={handleTextField(idx, 'company')} />
            </div>
            <div className="space-y-2">
              <Label>Role / Title</Label>
              <Input value={job.role} onChange={handleTextField(idx, 'role')} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Location</Label>
              <Input value={job.location} onChange={handleTextField(idx, 'location')} />
            </div>
          </div>

          {/* summary */}
          <div className="space-y-2">
            <Label>Role summary</Label>
            <Textarea
              rows={3}
              value={job.summary}
              onChange={handleTextField(idx, 'summary')}
              placeholder="Describe your work or responsibilities…"
            />
          </div>

          <Button variant="secondary" onClick={() => generateBullets(idx)}>
            ✨ Generate Bullet Points
          </Button>

          {/* user bullets */}
          <div className="space-y-2">
            <Label>Bullet Points</Label>
            {job.bullets.map((b, bIdx) => (
              <div key={bIdx} className="flex items-start gap-2">
                <Textarea
                  className="flex-1 min-h-[60px]"
                  value={b}
                  onChange={handleBulletChange(idx, bIdx)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => enhanceBullet(idx, bIdx)}
                >
                  ✨ Enhance
                </Button>
              </div>
            ))}

            <Button size="sm" variant="outline" onClick={() => addBullet(idx)}>
              Add Bullet Point
            </Button>
          </div>

          {/* suggestions */}
          {job.suggestions.length > 0 && (
            <div className="space-y-2 border-t pt-4">
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