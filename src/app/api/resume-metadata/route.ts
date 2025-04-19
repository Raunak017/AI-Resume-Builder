import { NextRequest, NextResponse } from "next/server";
import { uploadedFilesList } from "../upload-pdf/route";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !uploadedFilesList.has(id)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const file = uploadedFilesList.get(id);

  return NextResponse.json({
    id,
    name: file!.name,
    parsedData: file!.parsedData || null,
    mutatedData: file!.mutatedData || null,
  });
}
