import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generate bullet points from a user-provided description of their role/responsibilities.
 */
export async function generateFromSummary(
    summary: string,
    numBullets: number = 3
  ): Promise<string[]> {
    const prompt = `Generate ${numBullets} unique and impactful resume bullet points based on this role description:\n"${summary}". 
  Each bullet point should:
  - Start with a strong action verb
  - Be concise and achievement-driven
  - Include quantifiable results or metrics if possible
  - Avoid vague phrases or repetition`;
  
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'You are a helpful assistant who writes high-quality resume bullet points.' },
        { role: 'user', content: prompt },
      ],
    });
  
    return parseBulletPoints(res.choices[0].message.content);
  }

/**
 * Enhance a single bullet point for better impact and clarity.
 */
export async function enhanceBulletPoint(bullet: string): Promise<string> {
  const prompt = `Improve this resume bullet point for clarity, action, and impact:\n"${bullet}"`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4',
    temperature: 0.6,
    messages: [
      { role: 'system', content: 'You enhance resume bullet points for better clarity and impact.' },
      { role: 'user', content: prompt },
    ],
  });

  return res.choices[0].message.content?.trim() || bullet;
}

/**
 * Generate 1–2 additional bullet points based on what's already provided by the user.
 */
export async function generateMoreBulletPoints(
    existing: string[],
    roleSummary: string
  ): Promise<string[]> {
    const prompt = `Based on the following role: "${roleSummary}" and these existing bullet points:\n\n${existing.join(
      '\n'
    )}\n\nGenerate 2 more unique bullet points that add value, avoid repetition, and emphasize accomplishments.`;
  
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.7,
      messages: [
        { role: 'system', content: 'You generate additional professional bullet points for resumes.' },
        { role: 'user', content: prompt },
      ],
    });
  
    return parseBulletPoints(res.choices[0].message.content);
  }

/**
 * Utility: Parse bullet point response into array
 */
function parseBulletPoints(raw: string | undefined | null): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((line) =>
      line
        .trim()
        .replace(/^[–•\-\d\.]+\s*/, '')   // Remove leading bullets/numbers
        .replace(/^"+|"+$/g, '')          // Remove surrounding double quotes
    )
    .filter((line) => line.length > 0);
}