import { NbComponentStatus } from '@liquid-js/lyr-core';

import { blogImage, illustration } from '../shared/showcase-images';

export interface Post {
  title: string;
  excerpt: string;
  tag: string;
  author: string;
  date: Date;
  minutes: number;
  /** The author's avatar, if they have one. */
  avatar?: string;
  /** A cover photo; a post without one may have an icon instead, or no cover at all. */
  image?: string;
  icon?: string;
  status: NbComponentStatus;
}

export const POSTS: Post[] = [
  {
    title: 'How Fabrikam closed its books in an afternoon',
    excerpt: 'Three spreadsheets, two tools and a week of month-end became one dashboard and a coffee break.',
    tag: 'Customer story',
    author: 'Emma Brown',
    avatar: illustration('Emma Brown', 'open-peeps'),
    date: new Date(2026, 5, 12),
    minutes: 6,
    image: blogImage('team-meeting'),
    status: 'primary',
  },
  {
    title: 'Five follow-up habits of teams that keep their customers',
    excerpt: 'What we learned from 4,000 teams about the small things that make customers stay.',
    tag: 'Guide',
    author: 'John Smith',
    avatar: illustration('John Smith', 'open-peeps'),
    date: new Date(2026, 5, 4),
    minutes: 8,
    image: blogImage('team-laptops'),
    status: 'success',
  },
  {
    title: 'Reports for every plan',
    excerpt: 'Revenue, churn and pipeline reports now come with Starter too, along with a new export to PDF.',
    tag: 'Product news',
    author: 'Olivia Wilson',
    avatar: illustration('Olivia Wilson', 'open-peeps'),
    date: new Date(2026, 4, 28),
    minutes: 3,
    icon: 'pie-chart-outline',
    status: 'info',
  },
  {
    title: 'Invoices your customers pay on time',
    excerpt: 'Clear lines, the right reminders and a pay button: the details that get invoices paid sooner.',
    tag: 'Guide',
    author: 'Noah Davis',
    avatar: illustration('Noah Davis', 'open-peeps'),
    date: new Date(2026, 4, 19),
    minutes: 5,
    status: 'warning',
  },
  {
    title: 'Moving to Acme from a spreadsheet',
    excerpt: 'A step-by-step import of customers, deals and history, without losing a single note.',
    tag: 'Guide',
    author: 'Mia Clarke',
    avatar: illustration('Mia Clarke', 'open-peeps'),
    date: new Date(2026, 4, 7),
    minutes: 7,
    image: blogImage('planning'),
    status: 'primary',
  },
  {
    title: 'Security at Acme: what we do with your data',
    excerpt: 'Encryption, single sign-on and audit logs, and where your data lives.',
    tag: 'Company',
    author: 'Liam Johnson',
    date: new Date(2026, 3, 22),
    minutes: 4,
    status: 'danger',
  },
];
