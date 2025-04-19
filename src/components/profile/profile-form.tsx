import EducationSection from "@/components/profile/education"
// import CustomSection from "@/components/profile/custom"
import PersonalSection from "@/components/profile/personal"
import ProjectSection from "@/components/profile/projects"
import WorkExSection   from "@/components/profile/work_ex"

export default function ProfileForm() {
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PersonalSection />
      <EducationSection />
      {/* <ExperienceSection /> */}
      {/* <ProjectsSection /> */}
      {/* <CustomSection /> */}
      {/* <SkillsSection /> */}
      <WorkExSection />      {/* Work‑experience card */}
      <ProjectSection />
    </div>
  )
}