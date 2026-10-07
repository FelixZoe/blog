export const siteConfig = {
  name: 'awe0',
  title: 'Full-Stack Developer',
  location: 'China',
  email: 'zhuj3188@gmail.com',
  pronouns: 'he/him',
  avatar: '/assets/avatar.png',
  bio: 'I build end-to-end web products, paying attention to the small details that make software feel polished and effortless to use. Currently working with TypeScript, React, Next.js, Tailwind CSS.',
  url: process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000',
  ogImage: '/assets/logo.png',
  roles: [
    'Full-Stack Developer',
    'Curious Builder',
    'Creative Thinker',
    'Open-Source Contributor',
  ],
  social: {
    twitter: 'https://x.com/oemfelix',
    github: 'https://github.com/FelixZoe',
    email: 'mailto:zhuj3188@gmail.com',
  },
  author: {
    name: 'awe0',
    github: 'FelixZoe',
    twitter: '@oemfelix',
    email: 'zhuj3188@gmail.com',
  },
  keywords: [
    'awe0',
    'Full-Stack Developer',
    'portfolio',
    'web developer',
    'React',
    'Next.js',
    'TypeScript',
    'Node.js',
    'China',
  ],
  twitterHandle: '@oemfelix',
  quote: {
    text: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of actions.',
    author: 'Bhagavad Gita',
  },
  repository: 'https://github.com/FelixZoe/blog',
} as const;

export type SiteConfig = typeof siteConfig;
