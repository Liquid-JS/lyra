/** A treatment or class the studio offers. */
export interface BookService {
  id: string;
  name: string;
  blurb: string;
  /** In minutes. */
  duration: number;
  /** In pounds. */
  price: number;
  icon: string;
  status: 'primary' | 'info' | 'success' | 'warning';
}

/** Someone who gives the treatments. */
export interface BookPractitioner {
  name: string;
  title: string;
  services: string[];
}

export interface BookReview {
  name: string;
  text: string;
  rating: number;
}

export type BookBookingStatus = 'confirmed' | 'completed' | 'cancelled';

/** An appointment, booked or past. */
export interface BookBooking {
  reference: string;
  serviceId: string;
  practitioner: string;
  date: Date;
  /** As `HH:mm`. */
  time: string;
  status: BookBookingStatus;
}

export const STUDIO = {
  name: 'Still',
  tagline: 'Massage, physio and yoga in a calm corner of town.',
  address: ['14 Orchard Lane', 'Bristol BS1 5PT'],
  phone: '+44 117 496 0812',
  email: 'hello@stillstudio.example',
};

export const SERVICES: BookService[] = [
  {
    id: 'massage',
    name: 'Deep tissue massage',
    blurb: 'Slow, focused work on the muscles that carry your week.',
    duration: 60,
    price: 68,
    icon: 'droplet-outline',
    status: 'primary',
  },
  {
    id: 'physio',
    name: 'Physio session',
    blurb: 'Assessment and hands-on treatment, with exercises to take home.',
    duration: 45,
    price: 75,
    icon: 'activity-outline',
    status: 'info',
  },
  {
    id: 'yoga',
    name: 'Yoga class',
    blurb: 'A small morning class for every level, mats provided.',
    duration: 75,
    price: 18,
    icon: 'sun-outline',
    status: 'success',
  },
  {
    id: 'sports',
    name: 'Sports massage',
    blurb: 'Firm, targeted work before an event or after one.',
    duration: 30,
    price: 42,
    icon: 'flash-outline',
    status: 'warning',
  },
];

/** The practitioners, the people with portraits. */
export const PRACTITIONERS: BookPractitioner[] = [
  { name: 'Emma Brown', title: 'Massage therapist', services: ['massage', 'sports'] },
  { name: 'Noah Davis', title: 'Physiotherapist', services: ['physio', 'sports'] },
  { name: 'Sophie Taylor', title: 'Yoga teacher', services: ['yoga'] },
  { name: 'John Smith', title: 'Massage therapist', services: ['massage'] },
];

export const REVIEWS: BookReview[] = [
  {
    name: 'Olivia Wilson',
    text: 'Booked a massage on a Tuesday evening and walked out feeling two inches taller. The room is lovely and quiet.',
    rating: 5,
  },
  {
    name: 'Mia Clarke',
    text: 'Noah sorted out a knee that three months of rest hadn\'t. The exercises he gave me actually fit into a day.',
    rating: 5,
  },
  {
    name: 'Jane Doe',
    text: 'The morning yoga class is small enough that Sophie notices when you\'re cheating a stretch. In a good way.',
    rating: 4,
  },
];

/** The opening hours, a row per day; closed Sundays. */
export const HOURS: { days: string; hours?: string }[] = [
  { days: 'Monday to Friday', hours: '8:00 to 20:00' },
  { days: 'Saturday', hours: '9:00 to 16:00' },
  { days: 'Sunday' },
];

/** The times appointments start, as `HH:mm`. */
export const SLOTS = ['09:00', '09:45', '10:30', '11:15', '12:00', '13:30', '14:15', '15:00', '15:45', '16:30', '17:15'];

/** Midnight at the start of today plus some days. */
export function daysFromToday(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

/** Some days from today, or the Monday after when that's a Sunday, which the studio takes off. */
export function openDayFromToday(days: number): Date {
  const date = daysFromToday(days);
  return date.getDay() === 0 ? daysFromToday(days + 1) : date;
}

/** A slot is taken when the date and the slot say so: the same each time the page shows, different from day to day. */
export function slotTaken(date: Date, slot: string): boolean {
  const seed = date.getDate() * 7 + date.getMonth() * 3 + SLOTS.indexOf(slot) * 5;
  return seed % 4 === 0;
}

/** The customer's bookings: a few ahead, a few behind. */
export const BOOKINGS: BookBooking[] = [
  { reference: 'STL-4821', serviceId: 'physio', practitioner: 'Noah Davis', date: openDayFromToday(3), time: '10:30', status: 'confirmed' },
  { reference: 'STL-4903', serviceId: 'yoga', practitioner: 'Sophie Taylor', date: openDayFromToday(9), time: '09:00', status: 'confirmed' },
  { reference: 'STL-4466', serviceId: 'massage', practitioner: 'Emma Brown', date: openDayFromToday(-12), time: '17:15', status: 'completed' },
  { reference: 'STL-4310', serviceId: 'sports', practitioner: 'Noah Davis', date: openDayFromToday(-26), time: '14:15', status: 'completed' },
  { reference: 'STL-4188', serviceId: 'yoga', practitioner: 'Sophie Taylor', date: openDayFromToday(-33), time: '09:00', status: 'cancelled' },
];

export const serviceOf = (id: string): BookService | undefined => SERVICES.find((service) => service.id === id);
