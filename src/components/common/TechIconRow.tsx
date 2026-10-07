import type { Technology } from '@/config/Experience';
import Link from 'next/link';
import React from 'react';

import HoverBubble from './HoverBubble';

interface TechIconRowProps {
  technologies: Technology[];
}

export default function TechIconRow({ technologies }: TechIconRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {technologies.map((tech) => (
        <Link
          key={tech.name}
          href={tech.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tech.name}
          className="group relative text-icon flex size-7 items-center justify-center transition-transform duration-200 hover:scale-110"
        >
          <span className="flex size-5 items-center justify-center [&_svg]:size-full">
            {tech.icon}
          </span>
          <HoverBubble label={tech.name} />
        </Link>
      ))}
    </div>
  );
}
