'use client';

import type { Technology } from '@/config/Experience';
import Link from 'next/link';
import React from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';

interface TechIconRowProps {
  technologies: Technology[];
}

export default function TechIconRow({ technologies }: TechIconRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {technologies.map((tech) => (
        <Tooltip key={tech.name} delayDuration={200}>
          <TooltipTrigger asChild>
            <Link
              href={tech.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={tech.name}
              className="text-icon flex size-7 items-center justify-center transition-transform duration-200 hover:scale-110"
            >
              <span className="flex size-5 items-center justify-center [&_svg]:size-full">
                {tech.icon}
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={8}
            arrowClassName="fill-black dark:fill-zinc-900"
            className="rounded-2xl border-0 bg-black px-4 py-2 text-[13px] font-medium text-white shadow-lg dark:bg-zinc-900 dark:text-zinc-100"
          >
            {tech.name}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
