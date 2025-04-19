import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Project = {
  name: string
  from: string
  to: string
  bullets: string[]
}

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([
    { name: "", from: "", to: "", bullets: [""] },
  ])

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects]
    if (field === "bullets") {
      updated[index][field] = value.split(",") as unknown as Project["bullets"]
    } else {
      updated[index][field] = value
    }
    setProjects(updated)
  }

  const handleBulletChange = (projIndex: number, bulletIndex: number, value: string) => {
    const updated = [...projects]
    updated[projIndex].bullets[bulletIndex] = value
    setProjects(updated)
  }

  const addBulletPoint = (projIndex: number) => {
    const updated = [...projects]
    updated[projIndex].bullets.push("")
    setProjects(updated)
  }

  const addProject = () =>
    setProjects([...projects, { name: "", from: "", to: "", bullets: [""] }])

  return (
    <div className="space-y-6">
      <Label className="text-lg font-semibold">Projects</Label>

      {projects.map((proj, projIndex) => (
        <div key={projIndex} className="space-y-4 border p-4 rounded-md">
          <div className="space-y-2">
            <Label>Project Name</Label>
            <Input
              value={proj.name}
              onChange={(e) => handleProjectChange(projIndex, "name", e.target.value)}
              placeholder="e.g., Real-Time Collaboration App"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From (MM YYYY)</Label>
              <Input
                value={proj.from}
                onChange={(e) => handleProjectChange(projIndex, "from", e.target.value)}
                placeholder="e.g., 04 2023"
              />
            </div>
            <div className="space-y-2">
              <Label>To (MM YYYY)</Label>
              <Input
                value={proj.to}
                onChange={(e) => handleProjectChange(projIndex, "to", e.target.value)}
                placeholder="e.g., 12 2023"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bullet Points</Label>
            {proj.bullets.map((bullet, bulletIndex) => (
              <Textarea
                key={bulletIndex}
                value={bullet}
                onChange={(e) =>
                  handleBulletChange(projIndex, bulletIndex, e.target.value)
                }
                placeholder={`Description bullet #${bulletIndex + 1}`}
                className="min-h-[60px]"
              />
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
        </div>
      ))}

      <Button type="button" variant="default" onClick={addProject}>
        Add Another Project
      </Button>
    </div>
  )
}
