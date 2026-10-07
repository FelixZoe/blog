'use client';

import { githubConfig } from '@/config/Github';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, {
  type ReactElement,
  cloneElement,
  useEffect,
  useState,
} from 'react';
import type { Activity } from 'react-activity-calendar';

import Container from '../common/Container';
import FadeIn from '../common/FadeIn';
import GithubIcon from '../svgs/Github';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const ActivityCalendar = dynamic(
  () => import('react-activity-calendar').then((mod) => mod.default),
  {
    ssr: false,
    // Show the skeleton while the calendar's JS chunk loads, so there's
    // no empty gap between data arriving and the calendar rendering.
    loading: () => <ContributionSkeleton colorScheme="dark" />,
  },
);

type ContributionItem = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ApiContribution = {
  date: string;
  count: number;
  level: number;
};

type ApiResponse = {
  total?: Record<string, number> | number;
  contributions?: ApiContribution[];
};

function filterLastYear(contributions: ContributionItem[]): ContributionItem[] {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  return contributions
    .filter((item) => new Date(`${item.date}T00:00:00`) >= oneYearAgo)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function toLevel(level: number): ContributionItem['level'] {
  if (level <= 0) return 0;
  if (level === 1) return 1;
  if (level === 2) return 2;
  if (level === 3) return 3;
  return 4;
}

function formatContributionLabel(date: string, count: number) {
  const formatted = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (count === 0) return `No contributions on ${formatted}`;

  const word = count === 1 ? 'contribution' : 'contributions';
  return `${count} ${word} on ${formatted}`;
}

function ContributionBlock({
  block,
  activity,
}: {
  block: ReactElement<{ style?: React.CSSProperties }>;
  activity: Activity;
}) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        {cloneElement(block, {
          style: {
            ...block.props.style,
            cursor: 'pointer',
          },
        })}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className="animate-in fade-in-0 zoom-in-95 rounded-2xl border-0 bg-[#1f2328] px-2.5 py-1.5 text-[11px] font-normal text-white shadow-lg duration-150"
      >
        {formatContributionLabel(activity.date, activity.count)}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * Skeleton that mirrors the contribution calendar's exact layout
 * (739×143: month labels + 53×7 grid + footer) so loading feels like
 * the graph fading in, not popping into empty space.
 */
function ContributionSkeleton({
  colorScheme,
}: {
  colorScheme: 'dark' | 'light';
}) {
  // Use the same empty-cell colors as the real calendar so the skeleton
  // looks like the calendar's empty state (dark: near-black, light: near-white).
  const emptyColor =
    colorScheme === 'dark'
      ? githubConfig.theme.dark[0]
      : githubConfig.theme.light[0];
  const months = [
    'Oct',
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
  ];

  return (
    <div className="overflow-x-auto" aria-hidden>
      <div className="w-[739px] animate-pulse">
        {/* Month labels */}
        <div className="flex pt-[2px] text-[12px] leading-none text-muted">
          {months.map((month, i) => (
            <span
              key={month}
              className="shrink-0"
              style={{ width: i === 0 ? 52 : 62, marginRight: 2 }}
            >
              {month}
            </span>
          ))}
        </div>
        {/* Grid: 53 weeks × 7 days */}
        <div className="mt-[8px] flex gap-[3px]">
          {Array.from({ length: 53 }).map((_, week) => (
            <div key={week} className="flex shrink-0 flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, day) => (
                <div
                  key={day}
                  className="size-[11px] rounded-[2px]"
                  style={{ backgroundColor: emptyColor }}
                />
              ))}
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="mt-[8px] flex h-[18px] items-center justify-between text-[12px]">
          <span className="invisible">0 Contributions · 2025–26</span>
          <span className="invisible flex items-center gap-1">
            Less
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                className="size-[11px] rounded-[2px]"
                style={{ backgroundColor: emptyColor }}
              />
            ))}
            More
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Github() {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch('/contributions.json', {
          cache: 'no-store',
        });

        if (!response.ok) {
          setHasError(true);
          return;
        }

        const data: ApiResponse = await response.json();

        if (!data?.contributions || !Array.isArray(data.contributions)) {
          setHasError(true);
          return;
        }

        const validContributions = data.contributions
          .filter(
            (item): item is ApiContribution =>
              typeof item === 'object' &&
              item !== null &&
              typeof item.date === 'string' &&
              typeof item.count === 'number',
          )
          .map((item) => ({
            date: item.date,
            count: item.count,
            level: toLevel(Number(item.level) || 0),
          }));

        if (validContributions.length === 0) {
          setHasError(true);
          return;
        }

        const lastYear = filterLastYear(validContributions);
        const total = lastYear.reduce((sum, item) => sum + item.count, 0);

        setTotalContributions(total);
        setContributions(lastYear);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, []);

  const colorScheme = (resolvedTheme ?? theme) === 'dark' ? 'dark' : 'light';

  return (
    <Container className="mt-13">
      <FadeIn>
        {isLoading ? (
          <ContributionSkeleton colorScheme={colorScheme} />
        ) : hasError || contributions.length === 0 ? (
          <Link
            href={`https://github.com/${githubConfig.username}`}
            target="_blank"
            className="text-muted hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
          >
            <GithubIcon className="size-4" />
            View GitHub profile
          </Link>
        ) : (
          <TooltipProvider delayDuration={0}>
            <div className="overflow-x-auto">
              <ActivityCalendar
                data={contributions}
                blockSize={11}
                blockMargin={3}
                fontSize={12}
                colorScheme={colorScheme}
                maxLevel={4}
                hideTotalCount={false}
                theme={githubConfig.theme}
                renderBlock={(block, activity) => (
                  <ContributionBlock
                    key={activity.date}
                    block={block}
                    activity={activity}
                  />
                )}
                labels={{
                  months: githubConfig.months,
                  weekdays: githubConfig.weekdays,
                  totalCount: githubConfig.totalCountLabel.replace(
                    '{{count}}',
                    String(totalContributions),
                  ),
                }}
              />
            </div>
          </TooltipProvider>
        )}
      </FadeIn>
    </Container>
  );
}
