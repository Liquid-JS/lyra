// The showcase's sample images, served from the app's assets; their sources and licences are in CREDITS.md there.
const ROOT = 'assets/showcase';

// The people with pictures; the others show their initials, as people without a photo do in an app.
const PICTURED = new Set(['Jane Doe', 'John Smith', 'Emma Brown', 'Olivia Wilson', 'Noah Davis', 'Sophie Taylor', 'Mia Clarke']);

/** A person's portrait photo, for a formal layout, if they have one. */
export const portrait = (name: string) => (PICTURED.has(name) ? `${ROOT}/people/${slug(name)}.webp` : undefined);

/** A person's illustrated avatar, for a relaxed one (`notionists` or `open-peeps`), if they have one. */
export const illustration = (name: string, style: 'notionists' | 'open-peeps') =>
  PICTURED.has(name) ? `${ROOT}/illustrated/${style}/${slug(name)}.svg` : undefined;

export const productImage = (file: string) => `${ROOT}/products/${file}.webp`;
export const blogImage = (file: string) => `${ROOT}/blog/${file}.webp`;

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
