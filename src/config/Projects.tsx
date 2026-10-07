import Github from '@/components/technologies/Github';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';
import { Project } from '@/types/project';

function FlutterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M13.3 1.5 3.5 11.3l2.8 2.8 2-2-1 1 3 3 2.8-2.8-4.5-4.5 3.2-3.2 2.5 2.5-5 5 2.8 2.8L20.5 11 13.3 1.5z" />
    </svg>
  );
}

function DartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
      <path d="M12 2 2 12l4 4 2-2-2-2 4-4 2 2 4-4-2-2 4-4-2-2z" />
    </svg>
  );
}

export const projects: Project[] = [
  {
    title: 'TEMPO',
    description:
      'Local-first personal workspace: tasks, calendar, pomodoro, RSS and AI, with self-hosted sync. Time. Everything. Moments. Productivity. Organized.',
    image: '/project/tempo.png',
    link: 'https://github.com/FelixZoe/TEMPO',
    technologies: [
      { name: 'Flutter', icon: <FlutterIcon key="flutter" /> },
      { name: 'Dart', icon: <DartIcon key="dart" /> },
      { name: 'GitHub', icon: <Github key="github" /> },
    ],
    github: 'https://github.com/FelixZoe/TEMPO',
    live: 'https://github.com/FelixZoe/TEMPO',
    details: false,
    projectDetailsPageSlug: '/projects/tempo',
    isWorking: true,
  },
  {
    title: 'Micro-Lab',
    description:
      'Micro-interaction Lab — Apple-style 60fps micro-interaction showcase. A laboratory of delightful web micro-interactions.',
    image: '/project/micro-lab.png',
    link: 'https://github.com/FelixZoe/Micro-Lab',
    technologies: [
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'Tailwind CSS', icon: <TailwindCss key="tailwindcss" /> },
      { name: 'GitHub', icon: <Github key="github" /> },
    ],
    github: 'https://github.com/FelixZoe/Micro-Lab',
    live: 'https://github.com/FelixZoe/Micro-Lab',
    details: false,
    projectDetailsPageSlug: '/projects/micro-lab',
    isWorking: true,
  },
  {
    title: 'FlowTime',
    description:
      'Flow-state focus app: pomodoro timer, schedule, cloud drive, blog, AI assistant and cloud toolkit — Flutter cross-platform.',
    image: '/project/flowtime.png',
    link: 'https://github.com/FelixZoe/flowtime',
    technologies: [
      { name: 'Flutter', icon: <FlutterIcon key="flutter" /> },
      { name: 'Dart', icon: <DartIcon key="dart" /> },
      { name: 'GitHub', icon: <Github key="github" /> },
    ],
    github: 'https://github.com/FelixZoe/flowtime',
    live: 'https://github.com/FelixZoe/flowtime',
    details: false,
    projectDetailsPageSlug: '/projects/flowtime',
    isWorking: true,
  },
  {
    title: 'Deskemy',
    description:
      'Windows desktop course video player — watch and manage course videos right from your desk.',
    image: '/project/deskemy.png',
    link: 'https://github.com/FelixZoe/Deskemy',
    technologies: [
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'GitHub', icon: <Github key="github" /> },
    ],
    github: 'https://github.com/FelixZoe/Deskemy',
    live: 'https://github.com/FelixZoe/Deskemy',
    details: false,
    projectDetailsPageSlug: '/projects/deskemy',
    isWorking: true,
  },
];
