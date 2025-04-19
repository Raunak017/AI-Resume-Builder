import { NextRequest, NextResponse } from "next/server";
import { uploadedFilesList } from "../upload-pdf/route";
import OpenAI from "openai";
import safePdfParse from "@/lib/safePdfParse";

const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  console.log("🛬 API Hit: /api/parse-resume");
  console.log("🔎 Looking for file ID:", id);
  console.log("📁 Available IDs:", [...uploadedFilesList.keys()]);

  if (!id || !uploadedFilesList.has(id)) {
    console.warn("❌ File not found in memory:", id);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    const file = uploadedFilesList.get(id);
    if (!file || !file.buffer) {
      console.error("❌ File buffer missing for ID:", id);
      return NextResponse.json({ error: "File data missing" }, { status: 400 });
    }

    console.log(
      `📄 Found file: ${file.name} | Buffer Size: ${file.buffer.length}`
    );

    const rawText = await safePdfParse(file.buffer);
    // console.log("📜 Extracted text from PDF:", rawText.slice(0, 300), "...");

    const prompt = `
You're a resume parser. Based on the PDF text below, extract the resume info into a structured JSON format like:

{
  "name": "Full Name",
  "contact": { "email": "", "phone": "", "linkedin": "" },
  "skills": [],
  "summary": "...",
  "experience": [ ... ],
  "education": [ ... ],
  "projects": [ ... ]
}

Only return JSON.

---
${rawText}
---
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const rawContent = completion.choices[0].message?.content?.trim() || "{}";
    console.log("🤖 GPT Response:\n", rawContent);

    const cleaned = rawContent
      .replace(/^```(?:json)?/, "")
      .replace(/```$/, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (jsonErr) {
      console.error("❌ Failed to parse GPT response:", cleaned);
      return NextResponse.json(
        { error: "OpenAI returned invalid JSON" },
        { status: 500 }
      );
    }

    console.log("✅ Parsed Resume JSON:", parsed);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("❌ Unexpected error in /api/parse-resume:", err);
    return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
  }
}
