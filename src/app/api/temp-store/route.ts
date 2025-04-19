let tempData: any = null;

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  tempData = body;
  console.log("Stored temp data:", tempData);
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(tempData || {});
}
