import NextJs from '@/components/technologies/NextJs';
import NodeJs from '@/components/technologies/NodeJs';
import Prisma from '@/components/technologies/Prisma';
import ReactIcon from '@/components/technologies/ReactIcon';
import TailwindCss from '@/components/technologies/TailwindCss';
import TypeScript from '@/components/technologies/TypeScript';
import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: 'StackKinetix Studio',
    description:
      'We build AI systems that move — custom agents, intelligent workflows, and digital experiences that save teams 20+ hours every week.',
    image: '/project/stackkinetix-studio.png',
    link: 'https://stackkinetix.vercel.app/',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'Tailwind CSS', icon: <TailwindCss key="tailwindcss" /> },
      { name: 'Node.js', icon: <NodeJs key="nodejs" /> },
    ],
    live: 'https://stackkinetix.vercel.app/',
    details: false,
    projectDetailsPageSlug: '/projects/stackkinetix-studio',
    isWorking: true,
  },
  {
    title: 'ClaimUp',
    description:
      'ClaimUp is a bidding-based platform where startups and products compete for the #1 spotlight. Bid for your position, get discovered, and claim the top spot.',
    image: '/project/claimup.png',
    link: 'https://www.claimup.lol/',
    technologies: [
      { name: 'Next.js', icon: <NextJs key="nextjs" /> },
      { name: 'React', icon: <ReactIcon key="react" /> },
      { name: 'Tailwind CSS', icon: <TailwindCss key="tailwindcss" /> },
      { name: 'TypeScript', icon: <TypeScript key="typescript" /> },
      { name: 'Prisma', icon: <Prisma key="prisma" /> },
    ],
    live: 'https://www.claimup.lol/',
    details: false,
    projectDetailsPageSlug: '/projects/claimup',
    isWorking: true,
  },
];
