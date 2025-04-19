export async function fetchGeneratedBullets(summary: string, num = 3) {
    const res = await fetch('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ summary, numBullets: num }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data.bullets;
  }

  export async function fetchEnhancedBullet(bullet: string) {
    const res = await fetch('/api/ai/enhance', {
      method: 'POST',
      body: JSON.stringify({ bullet }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (!res.ok) {
      throw new Error('Failed to enhance bullet');
    }
  
    const { enhanced } = await res.json();
    return enhanced as string;
  }

  export async function fetchMoreBullets(existing: string[], summary: string) {
    const res = await fetch('/api/ai/more', {
      method: 'POST',
      body: JSON.stringify({ existingBullets: existing, summary }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return data.bullets;
  }