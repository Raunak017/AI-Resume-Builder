import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PersonalSection() {
    const [profileLinks, setProfileLinks] = useState([{ platform: "", url: "" }])
  
    const handleProfileChange = (index: number, key: "platform" | "url", value: string) => {
      const updated = [...profileLinks]
      updated[index][key] = value
      setProfileLinks(updated)
    }
  
    const addProfileLink = () => {
      setProfileLinks([...profileLinks, { platform: "", url: "" }])
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and how we can contact you</CardDescription>
        </CardHeader>
  
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first-name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
          </div>
  
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Enter your phone number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
  
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input id="location" placeholder="City, Country" />
          </div>
  
          <div className="space-y-2">
            <Label>Profile Links</Label>
            {profileLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder="Platform (e.g. LinkedIn)"
                  value={link.platform}
                  onChange={(e) => handleProfileChange(index, "platform", e.target.value)}
                />
                <Input
                  placeholder="URL (e.g. https://linkedin.com/in/yourname)"
                  value={link.url}
                  onChange={(e) => handleProfileChange(index, "url", e.target.value)}
                />
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                    const updated = [...profileLinks]
                    updated.splice(index, 1)
                    setProfileLinks(updated)
                    }}
                >
                    ✕
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addProfileLink}>
              Add Another Link
            </Button>
          </div>
        </CardContent>
  
        <CardFooter className="flex justify-end">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    )
  }