import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

type LinkedInProfile = {
  id: string;
  name: string;
  title: string;
  url: string;
};

const linkedInProfiles = new Map<string, LinkedInProfile>();

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.includes("linkedin.com/in/")) {
      return NextResponse.json(
        { error: "Invalid LinkedIn URL" },
        { status: 400 }
      );
    }

    // Fake parsing logic — replace this later with real parser / GPT call
    const name = url.split("/").pop()?.replace(/-/g, " ") || "John Doe";
    const profile: LinkedInProfile = {
      id: randomUUID(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      title: "Software Engineer at Demo Corp",
      url,
    };

    linkedInProfiles.set(profile.id, profile);
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const list = Array.from(linkedInProfiles.values());
  return NextResponse.json(list);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !linkedInProfiles.has(id)) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  linkedInProfiles.delete(id);
  return NextResponse.json({ success: true });
}
