"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";

export default function PersonalSection({ user }: { user: User | null }) {
  const supabase = createClientComponentClient();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    skills: "",
  });

  useEffect(() => {
    setMounted(true);
    fetchPersonal();
  }, [user]);
  
  const fetchPersonal = async () => {
    if (!user) return; 
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Failed to load personal information");
      console.error("Supabase fetch error:", error);
    } else {
      setFormData({
        full_name: data?.full_name || "",
        phone: data?.phone || "",
        location: data?.location || "",
        linkedin: data?.linkedin || "",
        github: data?.github || "",
        portfolio: data?.portfolio || "",
        skills: data?.skills || "",
      });
    }

  };
  

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const saveChangesHandler = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        location: formData.location,
        linkedin: formData.linkedin,
        github: formData.github,
        portfolio: formData.portfolio,
        skills: formData.skills,
      })
      .eq("id", user.id);

    if (error) {
      toast("Update failed", { description: error.message });
    } else {
      toast("Profile updated", {
        description: "Your personal information has been saved.",
      });
    }
  };

  return (
    <Card className="w-full">
      <Toaster />
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={onChangeHandler}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={onChangeHandler}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            {mounted && (
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                placeholder="Enter your email"
                disabled
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            placeholder="City, Country"
            value={formData.location}
            onChange={onChangeHandler}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">Skills </Label>
          <Input
            id="skills"
            placeholder="JavaScript, React, Node.js"
            value={formData.skills}
            onChange={onChangeHandler}
          />
        </div>

        <div className="space-y-2">
          <Label>Profile Links</Label>
          <div className="flex flex-col gap-1">
            <Input
              id="linkedin"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={onChangeHandler}
            />
            <Input
              id="github"
              placeholder="GitHub URL"
              value={formData.github}
              onChange={onChangeHandler}
            />
            <Input
              id="portfolio"
              placeholder="Portfolio URL"
              value={formData.portfolio}
              onChange={onChangeHandler}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={saveChangesHandler}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
