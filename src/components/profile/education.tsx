import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type Education = {
  name: string
  from: string
  to: string
  coursework: string[]
  cgpa: string
  major: string
  minor: string
}


export default function EducationSection() {
  const [education, setEducation] = useState<string[]>([""])

  const handleChange = (value: string, index: number) => {
    const updated = [...education]
    updated[index] = value
    setEducation(updated)
  }
  // const handleProjectChange = (index: number, field: keyof Education, value: string) => {
  //   const updated = [...projects]
  //   if (field === "bullets") {
  //     updated[index][field] = value.split(",") as unknown as Project["bullets"]
  //   } else {
  //     updated[index][field] = value
  //   }
  //   setProjects(updated)
  // }

  return (
    <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>Update your education details and leverage your background</CardDescription>
        </CardHeader>
  
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-6">
              <Label htmlFor="school-name">School Name</Label>
              <Input id="school-name" placeholder="Enter your school name" />
            </div>
          </div>

          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div> */}
  
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="major">Major</Label>
              <Input id="major" placeholder="Enter your major name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minor">Minor</Label>
              <Input id="minor" placeholder="Enter your minor name" />
            </div>
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="coursework">Relevant Coursework (Optional)</Label>
            <Input id="coursework" placeholder="" />
          </div>

          
          
        </CardContent>
  
        <CardFooter className="flex justify-end">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    
  )
}
