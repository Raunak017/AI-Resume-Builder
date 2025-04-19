import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SkillsSection() {
  const [skills, setSkills] = useState<string[]>([""])

  const handleChange = (value: string, index: number) => {
    const updated = [...skills]
    updated[index] = value
    setSkills(updated)
  }

  const addSkill = () => setSkills([...skills, ""])

  return (
    <div className="space-y-2">
      <Label>Skills</Label>
      {skills.map((skill, index) => (
        <Input
          key={index}
          value={skill}
          onChange={(e) => handleChange(e.target.value, index)}
          placeholder={`Skill #${index + 1}`}
        />
      ))}
      <Button variant="outline" onClick={addSkill} className="mt-2">Add Skill</Button>
    </div>
  )
}
