'use client';

import { techStack } from '@/config/TechStack';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';
import Container from '../common/Container';
import FadeIn from '../common/FadeIn';

function TechIcon({ name, icon, iconDark }: (typeof techStack)[number]) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src = mounted && resolvedTheme === 'dark' ? (iconDark ?? icon) : icon;

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div className="group flex size-8 cursor-default items-center justify-center rounded-md transition-transform duration-200 hover:scale-110 sm:size-9">
          <Image
            src={src}
            alt={name}
            width={28}
            height={28}
            className="size-6 object-contain sm:size-7"
            unoptimized
          />
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={8}
        arrowClassName="fill-black dark:fill-zinc-900"
        className="rounded-xl border-0 bg-black px-4 py-2 text-[13px] font-medium text-white shadow-lg dark:bg-zinc-900 dark:text-zinc-100"
      >
        {name}
      </TooltipContent>
    </Tooltip>
  );
}

export default function TechStack() {
  return (
    <Container className="mt-16">
      <FadeIn>
        <div className="section-kicker mb-5">Tech Stack</div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {techStack.map((tech) => (
            <TechIcon key={tech.name} {...tech} />
          ))}
        </div>
      </FadeIn>
    </Container>
  );
}
