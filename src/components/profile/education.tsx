'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

type Education = {
  school: string
  degree: string
  major: string
  minor: string
  gpa: string
  startDate: string
  endDate: string
  coursework: string
}

export default function EducationSection() {
  const [educations, setEducations] = useState<Education[]>([
    {
      school: '',
      degree: '',
      major: '',
      minor: '',
      gpa: '',
      startDate: '',
      endDate: '',
      coursework: '',
    },
  ])

  const handleChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updated = [...educations]
    updated[index][field] = value
    setEducations(updated)
  }

  const addEducation = () =>
    setEducations([
      ...educations,
      {
        school: '',
        degree: '',
        major: '',
        minor: '',
        gpa: '',
        startDate: '',
        endDate: '',
        coursework: '',
      },
    ])

  const deleteEducation = (index: number) => {
    const updated = [...educations]
    updated.splice(index, 1)
    setEducations(updated)
  }

  return (
    <div className="space-y-6">
      <Label className="text-lg font-semibold">Education</Label>

      {educations.map((edu, index) => (
        <div
          key={index}
          className="relative space-y-4 border p-4 rounded-md"
        >
          {educations.length > 1 && (
            <button
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
              onClick={() => deleteEducation(index)}
              aria-label="Delete education entry"
            >
              <X size={16} />
            </button>
          )}

          <div className="space-y-2">
            <Label>School</Label>
            <Input
              value={edu.school}
              onChange={(e) => handleChange(index, 'school', e.target.value)}
              placeholder="e.g., Stanford University"
            />
          </div>

          <div className="space-y-2">
            <Label>Degree</Label>
            <select
              value={edu.degree}
              onChange={(e) => handleChange(index, 'degree', e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Select degree</option>
              <option value="Bachelor's">Bachelor's</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Major</Label>
              <Input
                value={edu.major}
                onChange={(e) => handleChange(index, 'major', e.target.value)}
                placeholder="e.g., Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Minor <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                value={edu.minor}
                onChange={(e) => handleChange(index, 'minor', e.target.value)}
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>GPA</Label>
            <Input
              value={edu.gpa}
              onChange={(e) => handleChange(index, 'gpa', e.target.value)}
              placeholder="e.g., 3.8 / 4.0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="text"
                value={edu.startDate}
                onChange={(e) =>
                  handleChange(index, 'startDate', e.target.value)
                }
                placeholder="e.g., 08 2020"
              />
            </div>
            <div className="space-y-2">
              <Label>Graduation Date / Expected</Label>
              <Input
                type="text"
                value={edu.endDate}
                onChange={(e) =>
                  handleChange(index, 'endDate', e.target.value)
                }
                placeholder="e.g., 05 2024"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Relevant Coursework <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              rows={3}
              value={edu.coursework}
              onChange={(e) =>
                handleChange(index, 'coursework', e.target.value)
              }
              placeholder="List relevant classes separated by commas…"
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="default" onClick={addEducation}>
        Add Another Education
      </Button>
    </div>
  )
}