import { NextResponse } from 'next/server';

const WAKATIME_API = 'https://wakatime.com/api/v1';

type WakaTimeLanguage = {
  name: string;
  percent: number;
  total_seconds: number;
};

// Server-side proxy for WakaTime stats so the API key never hits the browser.
// Returns 7-day coding stats: total time + top language.
export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ ok: false, reason: 'no_key' });
  }

  try {
    const res = await fetch(`${WAKATIME_API}/users/current/stats/last_7_days`, {
      headers: {
        Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, reason: 'upstream' });
    }

    const json = await res.json();
    const data = json?.data;
    if (!data || typeof data.total_seconds !== 'number') {
      return NextResponse.json({ ok: false, reason: 'no_data' });
    }

    const languages: WakaTimeLanguage[] = Array.isArray(data.languages)
      ? data.languages
      : [];
    const top = languages[0];

    return NextResponse.json({
      ok: true,
      totalSeconds: Math.round(data.total_seconds),
      dailyAverageSeconds: Math.round(data.daily_average ?? 0),
      topLanguage: top?.name ?? null,
      topLanguagePercent:
        typeof top?.percent === 'number' ? Math.round(top.percent) : null,
      range: 'last_7_days',
    });
  } catch {
    return NextResponse.json({ ok: false, reason: 'error' });
  }
}
