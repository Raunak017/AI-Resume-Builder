import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

type FileData = {
  buffer: Buffer;
  name: string;
  mime: string;
  parsedData?: any; // ⬅️ parsed JSON resume
  mutatedData?: any[]; // ⬅️ array of AI-mutated versions
};

const uploadedFiles = new Map<string, FileData>();
export const uploadedFilesList = uploadedFiles;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = randomUUID();

    uploadedFiles.set(id, {
      buffer,
      name: file.name,
      mime: file.type || "application/pdf",
    });

    console.log(
      `📄 Uploaded: ${file.name} (${buffer.byteLength} bytes) [id=${id}]`
    );

    return NextResponse.json({ success: true, id, fileName: file.name });
  } catch (error) {
    console.error("❌ Error uploading PDF:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const list = searchParams.get("list");

  // 🆕 Return list of uploaded files
  if (list === "true") {
    const allFiles = Array.from(uploadedFiles.entries()).map(([id, file]) => ({
      id,
      name: file.name,
      parsed: !!file.parsedData,
      mutated: !!file.mutatedData?.length,
    }));
    return NextResponse.json(allFiles);
  }

  // ✅ Return single file by ID
  if (!id || !uploadedFiles.has(id)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const file = uploadedFiles.get(id)!;

  return new NextResponse(file.buffer, {
    status: 200,
    headers: {
      "Content-Type": file.mime,
      "Content-Disposition": `inline; filename="${file.name}"`,
    },
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !uploadedFiles.has(id)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  uploadedFiles.delete(id);
  console.log(`🗑️ Deleted file with id: ${id}`);

  return NextResponse.json({ success: true });
}
