// import PersonalSection from "@/components/profile/personal"
// import SkillsSection from "@/components/profile/skills"
import EducationSection from "@/components/profile/education"
// import ExperienceSection from "@/components/profile/experience"
// import ProjectsSection from "@/components/profile/projects"
// import CustomSection from "@/components/profile/custom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PersonalSection from "@/components/profile/personal"
import ProjectSection from "@/components/profile/projects"
export default function ProfileForm() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      <PersonalSection />
      <EducationSection />
      {/* <ExperienceSection /> */}
      {/* <ProjectsSection /> */}
      {/* <CustomSection /> */}
      {/* <SkillsSection /> */}
      <ProjectSection />
      
    </div>
  )
}