import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function EducationSection() {
  const [education, setEducation] = useState<string[]>([""])

  const handleChange = (value: string, index: number) => {
    const updated = [...education]
    updated[index] = value
    setEducation(updated)
  }

  const addEducation = () => setEducation([...education, ""])

  return (
    <div className="space-y-2">
      <Label>Skills</Label>
      {education.map((ed, index) => (
        <Input
          key={index}
          value={ed}
          onChange={(e) => handleChange(e.target.value, index)}
          placeholder={`Education #${index + 1}`}
        />
      ))}
      <Button variant="outline" onClick={addEducation} className="mt-2">Add Education</Button>
    </div>
  )
}
