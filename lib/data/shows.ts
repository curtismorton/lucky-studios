export interface Host {
  name: string;
  role: string;
  social?: {
    twitter?: string;
    instagram?: string;
  };
}

export interface Episode {
  number: number;
  title: string;
  duration: string;
  date: string;
}

export interface Show {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  genre: 'entertainment' | 'football' | 'lifestyle';
  stat: string;
  featured: boolean;
  description?: string;
  format?: string;
  hosts?: Host[];
  episodes?: Episode[];
  platforms?: {
    spotify?: string;
    apple?: string;
    youtube?: string;
  };
}

export const shows: Show[] = [
  {
    id: '1',
    slug: 'behind-the-screens',
    title: 'Behind the Screens',
    tagline: 'Entertainment',
    genre: 'entertainment',
    stat: '5M+ views',
    featured: true,
    description: 'Behind the Screens takes you inside the world of entertainment, featuring candid conversations with creators, actors, and industry insiders. Each episode uncovers the stories behind your favorite shows, movies, and digital content.',
    format: 'Weekly episodes, 45-60 minutes',
    hosts: [
      { name: 'Alex Morgan', role: 'Host & Producer', social: { twitter: '@alexmorgan', instagram: '@alexmorgan' } },
      { name: 'Sam Taylor', role: 'Co-Host', social: { twitter: '@samtaylor', instagram: '@samtaylor' } },
    ],
    episodes: [
      { number: 42, title: 'The Future of Streaming', duration: '52:30', date: '2024-01-15' },
      { number: 41, title: 'Breaking into Hollywood', duration: '48:15', date: '2024-01-08' },
      { number: 40, title: 'Indie Film Success Stories', duration: '55:20', date: '2024-01-01' },
    ],
    platforms: {
      spotify: 'https://open.spotify.com/show/example',
      apple: 'https://podcasts.apple.com/show/example',
      youtube: 'https://youtube.com/@behindthescreens',
    },
  },
  {
    id: '2',
    slug: 'back-post',
    title: 'Back Post',
    tagline: 'Football',
    genre: 'football',
    stat: 'William Hill Partner',
    featured: false,
    description: 'Back Post brings you the latest in football culture, tactics, and stories from the beautiful game. Join us for weekly discussions on Premier League action, transfer news, and deep dives into football history.',
    format: 'Weekly episodes, 30-40 minutes',
    hosts: [
      { name: 'Jamie Wright', role: 'Host', social: { twitter: '@jamiewright', instagram: '@jamiewright' } },
    ],
    episodes: [
      { number: 28, title: 'Transfer Window Analysis', duration: '38:45', date: '2024-01-14' },
      { number: 27, title: 'Premier League Roundup', duration: '35:20', date: '2024-01-07' },
      { number: 26, title: 'Championship Stories', duration: '42:10', date: '2023-12-31' },
    ],
    platforms: {
      spotify: 'https://open.spotify.com/show/example2',
      apple: 'https://podcasts.apple.com/show/example2',
      youtube: 'https://youtube.com/@backpost',
    },
  },
  {
    id: '3',
    slug: 'dont-get-me-started',
    title: "Don't Get Me Started with Abby Boom",
    tagline: 'Lifestyle',
    genre: 'lifestyle',
    stat: '10M+ Season 1',
    featured: false,
    description: "Abby Boom brings her unfiltered take on lifestyle, culture, and everything in between. From fashion to food, relationships to wellness, nothing is off-limits in this weekly deep dive into modern life.",
    format: 'Weekly episodes, 50-70 minutes',
    hosts: [
      { name: 'Abby Boom', role: 'Host', social: { twitter: '@abbyboom', instagram: '@abbyboom' } },
    ],
    episodes: [
      { number: 35, title: 'New Year, New You?', duration: '62:15', date: '2024-01-13' },
      { number: 34, title: 'Holiday Reflections', duration: '58:30', date: '2024-01-06' },
      { number: 33, title: 'Setting Boundaries', duration: '55:45', date: '2023-12-30' },
    ],
    platforms: {
      spotify: 'https://open.spotify.com/show/example3',
      apple: 'https://podcasts.apple.com/show/example3',
      youtube: 'https://youtube.com/@abbyboom',
    },
  },
  {
    id: '4',
    slug: 'coming-soon',
    title: 'Coming Soon',
    tagline: 'New Show',
    genre: 'entertainment',
    stat: 'Stay tuned',
    featured: false,
    description: 'A new show is coming to Lucky Studios. Stay tuned for updates!',
    format: 'TBA',
    hosts: [],
    episodes: [],
    platforms: {},
  },
];

export function getShowBySlug(slug: string): Show | undefined {
  return shows.find((show) => show.slug === slug);
}

