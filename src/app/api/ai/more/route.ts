import { NextResponse } from 'next/server';
import { generateMoreBulletPoints } from '@/lib/ai';

export async function POST(req: Request) {
  const { existingBullets = [], summary } = await req.json();

  if (!summary) {
    return NextResponse.json(
      { error: 'summary is required' },
      { status: 400 }
    );
  }

  const bullets = await generateMoreBulletPoints(existingBullets, summary);
  return NextResponse.json({ bullets });
}