"use client";

import ResumeForm from "@/components/resume-form";
import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

export default function YourResumePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUser(user);
      else {
        redirect("/login");
      }
    };

    getUser();
  }, [supabase]);
  return <ResumeForm user={user} />;
}