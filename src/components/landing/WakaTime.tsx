'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type WakaTimeStats = {
  ok: true;
  totalSeconds: number;
  dailyAverageSeconds: number;
  topLanguage: string | null;
  topLanguagePercent: number | null;
};

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.round((totalSeconds % 3600) / 60);
  if (h <= 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function WakaTime() {
  const [data, setData] = useState<WakaTimeStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/wakatime?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
      });

      if (!res.ok) return;

      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) return;

      const json: unknown = await res.json();
      if (
        json &&
        typeof json === 'object' &&
        (json as Record<string, unknown>).ok === true &&
        typeof (json as Record<string, unknown>).totalSeconds === 'number'
      ) {
        setData(json as WakaTimeStats);
      }
    } catch {
      // silent: widget simply stays hidden
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // WakaTime aggregates slowly; 5-minute refresh is plenty.
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  if (!loaded || !data) return null;

  return (
    <div className="mb-6">
      <p className="inline-flex max-w-full items-center gap-2 text-[12px] text-zinc-500 sm:text-[13px]">
        <Image
          src="/icons/pycharm.png"
          alt="PyCharm"
          width={14}
          height={14}
          className="size-3.5 shrink-0 rounded-[3px] sm:size-4"
        />
        <span className="shrink-0 font-medium">
          {formatDuration(data.totalSeconds)} coded
        </span>
        <span className="shrink-0 text-zinc-400 dark:text-zinc-600">
          in the last 7 days
        </span>
        {data.topLanguage && (
          <>
            <span className="shrink-0 text-zinc-400 dark:text-zinc-600">·</span>
            <span className="truncate text-zinc-500 dark:text-zinc-400">
              mostly {data.topLanguage}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
