export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';

let inMemoryExamsCache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes client cache

export async function fetchExamsCached(): Promise<any[]> {
  const now = Date.now();
  if (inMemoryExamsCache && (now - inMemoryExamsCache.timestamp < CACHE_TTL_MS)) {
    return inMemoryExamsCache.data;
  }

  try {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('ilovestudy_exams_cache');
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        if (now - timestamp < CACHE_TTL_MS) {
          inMemoryExamsCache = { data, timestamp };
          return data;
        }
      }
    }
  } catch (e) {}

  const res = await fetch(`${API_BASE_URL}/api/exams`);
  if (!res.ok) {
    throw new Error(`Failed to fetch exams: ${res.statusText}`);
  }
  const data = await res.json();
  inMemoryExamsCache = { data, timestamp: now };
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ilovestudy_exams_cache', JSON.stringify({ data, timestamp: now }));
    }
  } catch (e) {}

  return data;
}
