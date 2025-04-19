"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Download, Save, Eye } from "lucide-react"
import { generateResumePDF } from "@/lib/pdf-generator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

type ResumeData = {
  profile: {
    name: string
    email: string
    phone: string
    address: string
    summary: string
  }
  education: {
    institution: string
    degree: string
    year: string
    description: string
  }[]
  experience: {
    company: string
    position: string
    duration: string
    description: string
  }[]
  projects: {
    title: string
    technologies: string
    description: string
  }[]
  skills: {
    name: string
  }[]
}

const defaultResumeData: ResumeData = {
  profile: {
    name: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
  },
  education: [{ institution: "", degree: "", year: "", description: "" }],
  experience: [{ company: "", position: "", duration: "", description: "" }],
  projects: [{ title: "", technologies: "", description: "" }],
  skills: [{ name: "" }],
}

const fieldLabels: Record<string, string> = {
  // Profile
  name: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  address: "Location",
  summary: "Professional Summary",

  // Education
  institution: "Institution/University",
  degree: "Degree/Certificate",
  year: "Years Attended",

  // Experience
  company: "Company Name",
  position: "Job Title",
  duration: "Employment Period",

  // Projects
  title: "Project Name",
  technologies: "Technologies Used",

  // Common
  description: "Description",
}

export default function ResumeForm() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleChange = (section: keyof Omit<ResumeData, "profile">, index: number, field: string, value: string) => {
    setResumeData((prev) => {
      const updatedSection = [...prev[section]]
      updatedSection[index] = {
        ...updatedSection[index],
        [field]: value,
      }
      return {
        ...prev,
        [section]: updatedSection,
      }
    })
  }

  const handleProfileChange = (field: keyof ResumeData["profile"], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value,
      },
    }))
  }

  const addSectionItem = (section: keyof Omit<ResumeData, "profile">) => {
    const emptyItems = {
      education: { institution: "", degree: "", year: "", description: "" },
      experience: { company: "", position: "", duration: "", description: "" },
      projects: { title: "", technologies: "", description: "" },
      skills: { name: "" },
    }

    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], emptyItems[section]],
    }))

    toast.success("Item Added", {
      description: `New ${section.slice(0, -1)} entry added successfully.`,
    })
  }

  const removeSectionItem = (section: keyof Omit<ResumeData, "profile">, index: number) => {
    if (resumeData[section].length <= 1) {
      toast.error("Cannot Remove", {
        description: `You need at least one ${section.slice(0, -1)} entry.`,
      })
      return
    }

    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }))

    toast.success("Item Removed", {
      description: `${section.slice(0, -1)} entry removed successfully.`,
    })
  }

  const handleDownload = async () => {
    setLoading(true)
    try {
      const url = await generateResumePDF(resumeData)
      const link = document.createElement("a")
      link.href = url
      link.download = `${resumeData.profile.name || "resume"}.pdf`
      link.click()

      toast.success("Success!", {
        description: "Your resume PDF has been downloaded.",
      })

      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      console.error("Error generating PDF:", err)
      toast.error("Error", {
        description: "Failed to generate PDF. Please try again.",
      })
    }
    setLoading(false)
  }

  const handlePreview = async () => {
    setLoading(true)
    try {
      const url = await generateResumePDF(resumeData)
      setPreviewUrl(url)

      toast.success("Preview Ready", {
        description: "Your resume preview has been generated.",
      })
    } catch (err) {
      console.error("Error generating preview:", err)
      toast.error("Error", {
        description: "Failed to generate preview. Please try again.",
      })
    }
    setLoading(false)
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("resumeData", JSON.stringify(resumeData))
      toast.success("Saved", {
        description: "Your resume data has been saved to your browser.",
      })
    } catch (err) {
      toast.error("Error", {
        description: "Failed to save resume data.",
      })
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("resumeData")
      if (saved) {
        setResumeData(JSON.parse(saved))
        toast.success("Loaded", {
          description: "Your saved resume data has been loaded.",
        })
      }
    } catch (err) {
      toast.error("Error", {
        description: "Failed to load saved resume data.",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">Create a professional resume in minutes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveToLocalStorage}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={loadFromLocalStorage}>
            Load Saved
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            {/* Profile Section */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{fieldLabels.name}</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={resumeData.profile.name}
                        onChange={(e) => handleProfileChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{fieldLabels.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={resumeData.profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{fieldLabels.phone}</Label>
                      <Input
                        id="phone"
                        placeholder="(123) 456-7890"
                        value={resumeData.profile.phone}
                        onChange={(e) => handleProfileChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{fieldLabels.address}</Label>
                      <Input
                        id="address"
                        placeholder="City, State"
                        value={resumeData.profile.address}
                        onChange={(e) => handleProfileChange("address", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">{fieldLabels.summary}</Label>
                    <Textarea
                      id="summary"
                      placeholder="A brief summary of your professional background and goals"
                      rows={4}
                      value={resumeData.profile.summary}
                      onChange={(e) => handleProfileChange("summary", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Education Section */}
            <TabsContent value="education">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button onClick={() => addSectionItem("education")} size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" defaultValue={["item-0"]} className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg p-1">
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {index + 1}
                              </Badge>
                              <span>{edu.institution || edu.degree || `Education #${index + 1}`}</span>
                            </div>
                          </AccordionTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeSectionItem("education", index)
                                  }}
                                  className="h-8 w-8 mr-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove this education entry</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <AccordionContent className="pt-4 pb-2 px-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor={`institution-${index}`}>{fieldLabels.institution}</Label>
                              <Input
                                id={`institution-${index}`}
                                placeholder="University of Example"
                                value={edu.institution}
                                onChange={(e) => handleChange("education", index, "institution", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`degree-${index}`}>{fieldLabels.degree}</Label>
                              <Input
                                id={`degree-${index}`}
                                placeholder="Bachelor of Science"
                                value={edu.degree}
                                onChange={(e) => handleChange("education", index, "degree", e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <Label htmlFor={`year-${index}`}>{fieldLabels.year}</Label>
                            <Input
                              id={`year-${index}`}
                              placeholder="2018 - 2022"
                              value={edu.year}
                              onChange={(e) => handleChange("education", index, "year", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edu-description-${index}`}>{fieldLabels.description}</Label>
                            <Textarea
                              id={`edu-description-${index}`}
                              placeholder="Relevant coursework, achievements, etc."
                              rows={3}
                              value={edu.description}
                              onChange={(e) => handleChange("education", index, "description", e.target.value)}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Experience Section */}
            <TabsContent value="experience">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Work Experience</CardTitle>
                  <Button onClick={() => addSectionItem("experience")} size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" defaultValue={["item-0"]} className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg p-1">
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {index + 1}
                              </Badge>
                              <span>{exp.company || exp.position || `Experience #${index + 1}`}</span>
                            </div>
                          </AccordionTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeSectionItem("experience", index)
                                  }}
                                  className="h-8 w-8 mr-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove this experience entry</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <AccordionContent className="pt-4 pb-2 px-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor={`company-${index}`}>{fieldLabels.company}</Label>
                              <Input
                                id={`company-${index}`}
                                placeholder="Example Corp"
                                value={exp.company}
                                onChange={(e) => handleChange("experience", index, "company", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`position-${index}`}>{fieldLabels.position}</Label>
                              <Input
                                id={`position-${index}`}
                                placeholder="Software Engineer"
                                value={exp.position}
                                onChange={(e) => handleChange("experience", index, "position", e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <Label htmlFor={`duration-${index}`}>{fieldLabels.duration}</Label>
                            <Input
                              id={`duration-${index}`}
                              placeholder="Jan 2020 - Present"
                              value={exp.duration}
                              onChange={(e) => handleChange("experience", index, "duration", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`exp-description-${index}`}>{fieldLabels.description}</Label>
                            <Textarea
                              id={`exp-description-${index}`}
                              placeholder="Describe your responsibilities and achievements"
                              rows={3}
                              value={exp.description}
                              onChange={(e) => handleChange("experience", index, "description", e.target.value)}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Section */}
            <TabsContent value="projects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Projects</CardTitle>
                  <Button onClick={() => addSectionItem("projects")} size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" defaultValue={["item-0"]} className="space-y-4">
                    {resumeData.projects.map((project, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg p-1">
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {index + 1}
                              </Badge>
                              <span>{project.title || `Project #${index + 1}`}</span>
                            </div>
                          </AccordionTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeSectionItem("projects", index)
                                  }}
                                  className="h-8 w-8 mr-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove this project entry</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <AccordionContent className="pt-4 pb-2 px-2">
                          <div className="space-y-2 mb-4">
                            <Label htmlFor={`title-${index}`}>{fieldLabels.title}</Label>
                            <Input
                              id={`title-${index}`}
                              placeholder="Project Name"
                              value={project.title}
                              onChange={(e) => handleChange("projects", index, "title", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 mb-4">
                            <Label htmlFor={`technologies-${index}`}>{fieldLabels.technologies}</Label>
                            <Input
                              id={`technologies-${index}`}
                              placeholder="React, Node.js, MongoDB, etc."
                              value={project.technologies}
                              onChange={(e) => handleChange("projects", index, "technologies", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`project-description-${index}`}>{fieldLabels.description}</Label>
                            <Textarea
                              id={`project-description-${index}`}
                              placeholder="Describe the project, your role, and outcomes"
                              rows={3}
                              value={project.description}
                              onChange={(e) => handleChange("projects", index, "description", e.target.value)}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Section */}
            <TabsContent value="skills">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Skills</CardTitle>
                  <Button onClick={() => addSectionItem("skills")} size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Skill (e.g., JavaScript, Project Management, etc.)"
                          value={skill.name}
                          onChange={(e) => handleChange("skills", index, "name", e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSectionItem("skills", index)}
                          disabled={resumeData.skills.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Resume Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {previewUrl ? (
                <div className="aspect-[1/1.414] bg-white rounded-md overflow-hidden border">
                  <iframe src={previewUrl} className="w-full h-full" title="Resume Preview" />
                </div>
              ) : (
                <div className="aspect-[1/1.414] bg-gray-50 rounded-md flex items-center justify-center border">
                  <div className="text-center p-4">
                    <Eye className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-muted-foreground">Click "Preview" to see your resume</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={handlePreview} variant="outline" className="w-full" disabled={loading}>
                <Eye className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Preview"}
              </Button>
              <Button onClick={handleDownload} className="w-full" disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
