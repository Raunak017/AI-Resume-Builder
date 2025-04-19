// profile-form.tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, Download } from "lucide-react"
import { User } from "@supabase/auth-helpers-nextjs"

import PersonalSection from "@/components/profile/personal"
import WorkExSection from "@/components/profile/work_ex"
import ProjectSection from "@/components/profile/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import EducationSection from "./education";

export default function ProfileForm({ user }: { user: User | null }) {
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePreview = async () => {
    setLoading(true)
    // Simulate preview generation
    setTimeout(() => {
      setPreviewUrl("/sample-resume.pdf") // Replace with your actual preview logic
      setLoading(false)
    }, 1000)
  }

  const handleDownload = async () => {
    // Simulate file download or trigger actual PDF download
    window.open("/sample-resume.pdf", "_blank")
  }

  const handleNavigate = () => {
    router.push("/your-resume")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      <div className="lg:col-span-2 flex flex-col gap-3">
        <PersonalSection user={user} />
        <EducationSection user={user}/>
      <WorkExSection user={user} />
        <ProjectSection user={user}/>
        <Button onClick={handleNavigate} className="mt-4 self-start">
          Go to Final Resume
        </Button>
      </div>
    </div>
  )
}
