import { NextRequest, NextResponse } from "next/server";

let uploadedPDF: Buffer | null = null;
let fileName = "";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    uploadedPDF = buffer;
    fileName = file.name;

    console.log(
      "📄 PDF stored in memory:",
      fileName,
      buffer.byteLength,
      "bytes"
    );

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error("❌ Error uploading PDF:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!uploadedPDF) {
    return NextResponse.json({ error: "No file stored yet" }, { status: 404 });
  }

  return new NextResponse(uploadedPDF, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
