import { NextResponse } from 'next/server';
import { generateFromSummary } from '@/lib/ai';

export async function POST(req: Request) {
  const { summary, numBullets = 3 } = await req.json();

  if (!summary) {
    return NextResponse.json(
      { error: 'summary is required' },
      { status: 400 }
    );
  }

  const bullets = await generateFromSummary(summary, numBullets);
  return NextResponse.json({ bullets });
}