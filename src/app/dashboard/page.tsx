// import ProfilePage from "@/components/profile/profile-page"

// export default function Dashboard() {
//   return <ProfilePage />
// }

import ResumeForm from "@/components/resume-form"
import { Toaster } from "@/components/ui/sonner"
export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Resume Builder</h1>
      <ResumeForm />
      <Toaster richColors position="top-right" />
    </main>
  )
}