import PersonalSection from "@/components/profile/personal";
import WorkExSection from "@/components/profile/work_ex";
import ProjectSection from "@/components/profile/projects";
import { User } from "@supabase/auth-helpers-nextjs";

export default function ProfileForm({ user }: { user: User | null }) {
  return (
    <div className="w-full md:w-8/10 flex flex-col gap-3">
      <PersonalSection user={user} />
      <WorkExSection user={user} />
      <ProjectSection />
    </div>
  );
}
