'use client';

import { githubConfig } from '@/config/Github';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, {
  type ReactElement,
  cloneElement,
  useEffect,
  useState,
} from 'react';
import ActivityCalendar from 'react-activity-calendar';
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

/**
 * Invisible placeholder that reserves the calendar's exact space (739×143)
 * while loading. No spinner — the data loads in milliseconds, so this
 * feels instant like a static site.
 */
function CalendarPlaceholder() {
  return (
    <div className="overflow-x-auto" aria-hidden>
      <div className="h-[143px] w-[739px]" />
    </div>
  );
}

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
          <CalendarPlaceholder />
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
