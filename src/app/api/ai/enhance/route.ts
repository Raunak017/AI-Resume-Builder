console.log('OPENAI_API_KEY:', JSON.stringify(process.env.OPENAI_API_KEY));

import { NextResponse } from 'next/server';
import { enhanceBulletPoint } from '@/lib/ai';

export async function POST(req: Request) {
  const { bullet } = await req.json();
  const result = await enhanceBulletPoint(bullet);
  return NextResponse.json({ enhanced: result });
}
