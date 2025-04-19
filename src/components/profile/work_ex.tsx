"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { parseMonthYearString, formatToMonthYear } from "@/lib/date_util";

import { fetchGeneratedBullets, fetchEnhancedBullet } from "@/lib/api";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { error } from "console";
import { toast, Toaster } from "sonner";

/* ---------- data shapes ---------- */

type alertState = {
  active: boolean;
  message: string;
};

type Job = {
  company: string;
  role: string;
  location: string;
  from: string;
  to: string;
  currently: boolean;
  summary: string;
  bullets: string[];
  suggestions: string[];
  showSuggestions: boolean;
};

type TextField = "company" | "role" | "location" | "from" | "to" | "summary";

/* ---------- component ---------- */

export default function WorkExSection({ user }: { user: User | null }) {
  // State
  const supabase = createClientComponentClient();
  const [alertState, setAlertState] = useState<alertState>({
    active: false,
    message: "",
  });

  const [jobs, setJobs] = useState<Job[]>([
    {
      company: "",
      role: "",
      location: "",
      from: "",
      to: "",
      currently: false,
      summary: "",
      bullets: [""],
      suggestions: [],
      showSuggestions: true,
    },
  ]);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      const { data: existingJobs, error: fetchError } = await supabase
        .from("experiences")
        .select("*")
        .eq("profileid", user.id);

      if (fetchError) {
        console.error("Error fetching jobs:", fetchError.message);
      } else {
        const cloudData: Job[] = [];

        existingJobs.forEach((elem) => {
          cloudData.push({
            company: elem.company,
            role: elem.role,
            location: elem.role,
            from: formatToMonthYear(elem.startdate),
            to: formatToMonthYear(elem.enddate),
            currently: false,
            summary: elem.description.summary,
            bullets: elem.description.bullets,
            suggestions: [],
            showSuggestions: true,
          });
        });

        setJobs(cloudData);
      }
    };

    if (user?.id) {
      fetchJobs();
    }
  }, [user]);

  /* error messages for no text in fields */
  const [bulletErrors, setBulletErrors] = useState<Record<string, boolean>>({});
  const [summaryErrors, setSummaryErrors] = useState<Record<number, boolean>>(
    {}
  );

  /* immutable update helper */
  const mutate = (fn: (draft: Job[]) => void) =>
    setJobs((prev) => {
      const next = structuredClone(prev) as Job[];
      fn(next);
      return next;
    });

  /* ----- field handlers ----- */

  const handleText =
    (idx: number, field: TextField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      mutate((d) => {
        d[idx][field] = e.target.value;
      });

  const toggleCurrently = (idx: number) =>
    mutate((d) => {
      const job = d[idx];
      job.currently = !job.currently;
      if (job.currently) job.to = "";
    });

  const handleBullet =
    (jobIdx: number, bulletIdx: number) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      mutate((d) => {
        d[jobIdx].bullets[bulletIdx] = e.target.value;
      });

  /* ----- list actions ----- */

  const addBullet = (idx: number) =>
    mutate((d) => {
      d[idx].bullets.push("");
    });

  const deleteBullet = (jobIdx: number, bulletIdx: number) =>
    mutate((d) => {
      d[jobIdx].bullets.splice(bulletIdx, 1);
    });

  const addJob = () =>
    mutate((d) => {
      d.push({
        company: "",
        role: "",
        location: "",
        from: "",
        to: "",
        currently: false,
        summary: "",
        bullets: [""],
        suggestions: [],
        showSuggestions: true,
      });
    });

  const deleteJob = (idx: number) =>
    mutate((d) => {
      d.splice(idx, 1);
    });

  /* ----- AI helpers ----- */

  const enhanceBullet = async (jobIdx: number, bulletIdx: number) => {
    const bullet = jobs[jobIdx].bullets[bulletIdx].trim();
    const key = `${jobIdx}-${bulletIdx}`;

    if (!bullet) {
      setBulletErrors((prev) => ({ ...prev, [key]: true }));
      return;
    }

    setBulletErrors((prev) => ({ ...prev, [key]: false })); // clear error if valid

    const upgraded = (await fetchEnhancedBullet(bullet)).replace(
      /^"+|"+$/g,
      ""
    );
    mutate((d) => {
      d[jobIdx].bullets[bulletIdx] = upgraded;
    });
  };

  const generateBullets = async (jobIdx: number) => {
    const summary = jobs[jobIdx].summary.trim();
    if (!summary) {
      setSummaryErrors((prev) => ({ ...prev, [jobIdx]: true }));
      return;
    }

    setSummaryErrors((prev) => ({ ...prev, [jobIdx]: false }));

    const ideas = await fetchGeneratedBullets(summary, 4);
    mutate((d) => {
      d[jobIdx].suggestions = ideas;
      d[jobIdx].showSuggestions = true;
    });
  };

  const toggleSuggestion = (jobIdx: number, suggestion: string) =>
    mutate((d) => {
      const list = d[jobIdx].bullets;
      if (list.includes(suggestion)) {
        d[jobIdx].bullets = list.filter((s) => s !== suggestion);
      } else {
        const emptyIndex = list.findIndex((s) => s === "");
        if (emptyIndex !== -1) {
          list[emptyIndex] = suggestion;
        } else {
          list.push(suggestion);
        }
      }
    });

  const hideSuggestions = (idx: number) =>
    mutate((d) => {
      d[idx].showSuggestions = false;
    });

  const saveHandler = async () => {
    if (!user) return;

    for (const job of jobs) {
      let startDate, endDate;

      // Validate and parse dates
      try {
        startDate = parseMonthYearString(job.from);
        endDate = parseMonthYearString(job.to);
      } catch (error) {
        setAlertState({
          active: true,
          message: "Date format is incorrect. Use MM YYYY.",
        });
        return; // Exit the entire saveHandler on error
      }

      const formData = {
        company: job.company,
        startdate: startDate,
        enddate: endDate,
        location: job.location,
        role: job.role,
        description: {
          summary: job.summary,
          bullets: job.bullets,
        },
      };

      const { data: existingJobs, error: fetchError } = await supabase
        .from("experiences")
        .select("id")
        .eq("profileid", user.id);

      if (fetchError) {
        toast("Fetch failed", { description: fetchError.message });
        continue;
      }

      if (existingJobs && existingJobs.length > 0) {
        // ✏️ Update existing job
        const existingJobId = existingJobs[0].id;

        const { error: updateError } = await supabase
          .from("experiences")
          .update({ ...formData })
          .eq("id", existingJobId);

        if (updateError) {
          toast("Update failed", { description: updateError.message });
        } else {
          toast("Job updated", {
            description: `${job.role} at ${job.company} updated successfully.`,
          });
        }
      } else {
        // ➕ Insert new job
        const { error: insertError } = await supabase
          .from("experiences")
          .insert([{ ...formData, profileid: user.id }]);

        if (insertError) {
          toast("Insert failed", { description: insertError.message });
        } else {
          toast("Job added", {
            description: `${job.role} at ${job.company} added successfully.`,
          });
        }
      }
    }
  };

  /* ---------- render ---------- */

  return (
    <Card>
      <Toaster />
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Update your work experience</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {jobs.map((job, idx) => (
            <div key={idx} className="relative space-y-6 border p-4 rounded-md">
              {/* delete job */}
              {jobs.length > 1 && (
                <button
                  className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                  onClick={() => deleteJob(idx)}
                  aria-label="Delete job"
                >
                  <X size={16} />
                </button>
              )}

              {/* basic fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={job.company}
                    onChange={handleText(idx, "company")}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role / Title</Label>
                  <Input
                    value={job.role}
                    onChange={handleText(idx, "role")}
                    placeholder="Role / Title"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Location</Label>
                  <Input
                    value={job.location}
                    onChange={handleText(idx, "location")}
                    placeholder="Company Location"
                  />
                </div>
              </div>

              {/* dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From (MM YYYY)</Label>
                  <Input
                    value={job.from}
                    onChange={handleText(idx, "from")}
                    placeholder="e.g., 01 2022"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>To (MM YYYY)</Label>
                    <div className="flex items-center gap-1 text-xs">
                      <input
                        id={`cur-${idx}`}
                        type="checkbox"
                        checked={job.currently}
                        onChange={() => toggleCurrently(idx)}
                      />
                      <label htmlFor={`cur-${idx}`}>Current</label>
                    </div>
                  </div>
                  <Input
                    value={job.to}
                    onChange={handleText(idx, "to")}
                    placeholder="e.g., 06 2024"
                    disabled={job.currently}
                  />
                </div>
              </div>

              {/* summary */}
              <div className="space-y-2">
                <Label>Role summary</Label>
                <Textarea
                  rows={3}
                  value={job.summary}
                  onChange={handleText(idx, "summary")}
                  placeholder="Describe your work or responsibilities…"
                />
                {summaryErrors[idx] && (
                  <p className="text-red-500 text-xs mt-1">
                    Role summary is required to generate bullet points.
                  </p>
                )}
              </div>

              <Button variant="secondary" onClick={() => generateBullets(idx)}>
                ✨ Generate Bullet Points
              </Button>

              {/* suggestions */}
              {job.showSuggestions && job.suggestions.length > 0 && (
                <div className="space-y-2 border-t pt-4 relative">
                  <button
                    className="absolute top-1 right-1 text-muted-foreground hover:text-destructive"
                    onClick={() => hideSuggestions(idx)}
                    aria-label="Hide suggestions"
                  >
                    <X size={14} />
                  </button>

                  <Label>Suggestions (click to add/remove)</Label>
                  {job.suggestions.map((s, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={job.bullets.includes(s)}
                        onChange={() => toggleSuggestion(idx, s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* bullets */}
              <div className="space-y-2">
                <div>
                  <Label>Bullet Points</Label>
                  {/* <p className="text-xs text-muted-foreground">
                Tell us what you worked on and we'll write it for you. Click ✨ to enhance.
                </p> */}
                </div>

                {job.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 w-full">
                    <div className="flex-1">
                      <Textarea
                        className="min-h-[60px] w-full"
                        value={b}
                        onChange={handleBullet(idx, bIdx)}
                        placeholder="Tell us what you worked on and we'll enhance it for you"
                      />
                      {bulletErrors[`${idx}-${bIdx}`] && (
                        <p className="text-red-500 text-xs mt-1">
                          This field is required to use ✨ Enhance.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => enhanceBullet(idx, bIdx)}
                      >
                        ✨ Enhance
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => deleteBullet(idx, bIdx)}
                        aria-label="Delete bullet"
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addBullet(idx)}
                >
                  Add Bullet Point
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="default" onClick={addJob}>
          Add Another Job
        </Button>
        <Button onClick={saveHandler}>Save Changes</Button>
      </CardFooter>
      <AlertDialog
        open={alertState.active}
        onOpenChange={(open) =>
          setAlertState((prev) => ({ ...prev, active: open }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Form Data Error!</AlertDialogTitle>
            <AlertDialogDescription>
              {alertState.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertState({ active: false, message: "" })}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
