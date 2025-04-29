"use client"

import { useEffect, useState } from "react"
import { Eye, Download } from "lucide-react"
import { generateResumePDF } from "@/lib/pdf-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import type { User } from "@supabase/auth-helpers-nextjs"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

import type { ResumeData } from "@/types/supabase"

const defaultResumeData: ResumeData = {
  profile: {
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  education: [{ institution: "", degree: "", from: "", to: "", major: "", minor: "", gpa: "", coursework: [] }],
  experience: [{
    company: "",
    role: "",
    location: "",
    from: "",
    to: "",
    currently: false,
    summary: "",
    bullets: [""],
  }],
  projects: [{ title: "", technologies: "", description: "" }],
  skills: [{ name: "" }],
}

export default function ResumeForm({ user }: { user: User | null }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    if (!user) return;

    const fetchAllData = async () => {
      setLoading(true);

      try {
        // --- Fetch Profile ---
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw new Error("Could not fetch profile");

        // --- Fetch Education ---
        const { data: educationData, error: educationError } = await supabase
          .from("educations")
          .select("*")
          .eq("profileid", user.id)
          .single();

        if (educationError) throw new Error("Could not fetch education data");

        // --- Fetch Experience ---
        const { data: experiences, error: expError } = await supabase
          .from("experiences")
          .select("*")
          .eq("profileid", user.id);

        if (expError) throw new Error("Could not fetch experience data");

        // --- Format Experience ---
        const formattedExperience =
          experiences?.map((exp) => ({
            company: exp.company,
            role: exp.role,
            location: exp.location,
            from: formatToMonthYear(exp.from),
            to: formatToMonthYear(exp.to),
            currently: false,
            summary: exp.summary || "",
            bullets: exp.bullets || [],
          })) || [];

        // --- Set resumeData once ---
        setResumeData((prev) => ({
          ...prev,
          profile: {
            name: profileData.full_name || "",
            email: profileData.email || "",
            phone: profileData.phone || "",
            address: profileData.location || "",
            linkedin: profileData.linkedin || "",
            github: profileData.github || "",
            portfolio: profileData.portfolio || "",
          },
          skills: profileData.skills
            ? profileData.skills.split(",").map((skill: string) => ({ name: skill.trim() }))
            : [],
          experience: formattedExperience,
          education: educationData
            ? [
                {
                  institution: educationData.school,
                  degree: educationData.degree,
                  from: formatToMonthYear(educationData.startDate),
                  to: formatToMonthYear(educationData.endDate),
                  major: educationData.major,
                  minor: educationData.minor,
                  gpa: educationData.gpa,
                  coursework: educationData.coursework || [],
                },
              ]
            : [],
        }));
      } catch (error) {
        console.error("Error loading resume data:", error);
        toast.error("Failed to fetch resume data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  useEffect(() => {
    if (!resumeData.profile.name) return;

    const generatePreview = async () => {
      setLoading(true);
      try {
        const url = await generateResumePDF(resumeData);
        setPreviewUrl(url);
        toast.success("Preview Ready");
      } catch (err) {
        console.error("Preview generation failed", err);
        toast.error("Error", { description: "Failed to generate preview." });
      } finally {
        setLoading(false);
      }
    };

    generatePreview();
  }, [resumeData]);
  

  const formatToMonthYear = (dateStr: string | null): string => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // const handleDownloadPDF = async () => {
  //   try {
  //     setLoading(true)
  //     const url = await generateResumePDF(resumeData)
  //     setPreviewUrl(url)
  //     toast.success("PDF generated successfully!")
  //   } catch (error) {
  //     console.error("PDF generation error:", error)
  //     toast.error("Failed to generate PDF")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleDownload = async () => {
    setLoading(true)
    try {
      const url = await generateResumePDF(resumeData)
      const link = document.createElement("a")
      link.href = url
      link.download = `${resumeData.profile.name || "resume"}.pdf`
      link.click()
      toast.success("Downloaded", { description: "Your resume PDF is ready." })
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      toast.error("Error", { description: "Failed to generate PDF." })
    }
    setLoading(false)
  }

  const handlePreview = async () => {
    setLoading(true)
    try {
      const url = await generateResumePDF(resumeData)
      setPreviewUrl(url)
      toast.success("Preview Ready")
    } catch (err) {
      toast.error("Error", { description: "Failed to generate preview." })
    }
    setLoading(false)
  }

  return (
    <div className="flex justify-center w-full px-4 py-8">
      <div className="w-full max-w-4xl">
        <Card className="mx-auto w-full max-w-2xl sticky top-4">
          <CardHeader>
            <CardTitle>Resume Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full aspect-[1/1.414] border rounded-md"
              />
            ) : (
              <div className="w-full aspect-[1/1.414] flex flex-col items-center justify-center bg-gray-50 border rounded-md text-center text-muted-foreground p-4">
                <Eye className="h-8 w-8 mb-2" />
                <p>Click "Preview" to see your resume</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              onClick={handlePreview}
              variant="outline"
              disabled={loading}
            >
              <Eye className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Preview"}
            </Button>
            <Button onClick={handleDownload} disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Generating..." : "Download PDF"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}  