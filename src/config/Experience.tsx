import Github from '@/components/technologies/Github';
import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';

export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image?: string;
  description: string[];
  startDate: string;
  endDate: string;
  website?: string;
  technologies: Technology[];
  isCurrent: boolean;
}

export const experiences: Experience[] = [
  {
    isCurrent: true,
    company: 'China Three Gorges University',
    position: 'B.S. Computer Science',
    location: 'Yichang, China',
    description: [
      'Undergraduate student focused on backend engineering, AI/LLM applications and agent systems.',
      'Building self-hosted infrastructure and shipping personal projects: local-first productivity apps, developer tools and automation.',
    ],
    startDate: 'Sep 2025',
    endDate: 'Present',
    website: 'https://www.ctgu.edu.cn/',
    technologies: [
      {
        name: 'TypeScript',
        href: 'https://typescriptlang.org/',
        icon: <TypeScript />,
      },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      { name: 'Next.js', href: 'https://nextjs.org/', icon: <NextJs /> },
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        icon: <TailwindCss />,
      },
      { name: 'GitHub', href: 'https://github.com/FelixZoe', icon: <Github /> },
    ],
  },
];

export interface FeaturedProject {
  title: string;
  description: string;
  image: string;
  live?: string;
  github?: string;
  technologies: Technology[];
}

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'TEMPO',
    description:
      'Local-first personal workspace: tasks, calendar, pomodoro, RSS and AI, with self-hosted sync.',
    image: '/project/tempo.png',
    live: 'https://github.com/FelixZoe/TEMPO',
    github: 'https://github.com/FelixZoe/TEMPO',
    technologies: [
      {
        name: 'TypeScript',
        href: 'https://typescriptlang.org/',
        icon: <TypeScript />,
      },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        icon: <TailwindCss />,
      },
    ],
  },
  {
    title: 'Micro-Lab',
    description:
      'Micro-interaction Lab — Apple-style 60fps micro-interaction showcase.',
    image: '/project/micro-lab.png',
    live: 'https://github.com/FelixZoe/Micro-Lab',
    github: 'https://github.com/FelixZoe/Micro-Lab',
    technologies: [
      {
        name: 'TypeScript',
        href: 'https://typescriptlang.org/',
        icon: <TypeScript />,
      },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        icon: <TailwindCss />,
      },
    ],
  },
];
