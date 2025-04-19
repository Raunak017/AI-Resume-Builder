// import ProfilePage from "@/components/profile/profile-page"

// export default function Dashboard() {
//   return <ProfilePage />
// }
import { createClient } from '@supabase/supabase-js'
import ResumeForm from "@/components/resume-form"
import { Toaster } from "@/components/ui/sonner"


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string // <-- get from your friend
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string // <-- get this too

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase environment variables are not set");
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  // const { data, error } = await supabase.from('profiles').select('*').limit(1)
  // const { data, error } = await supabase.from("profiles").upsert([
  //   {
  //     id: "98b1392c-0afc-45ba-97bf-59e5312a36b0", // Optional: if you want to update this row
  //     email: "newuser@example.com",
  //     full_name: "John Doe",
  //     phone: "123-456-7890",
  //     location: "New York",
  //     linkedin: "https://linkedin.com/in/johndoe",
  //     github: "https://github.com/johndoe",
  //     skills: "JavaScript, React, Node.js",
  //     portfolio: "https://johndoe.dev",
  //   },
  // ])

  return (

    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Resume Builder</h1>
      <ResumeForm />
      <Toaster richColors position="top-right" />
    </main>
  )
}