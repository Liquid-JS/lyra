import { NbComponentStatus } from '@liquid-js/lyr-core';

import { portrait } from '../shared/showcase-images';
import { ShowcaseLogoName } from '../shared/showcase-logos';

export interface Customer {
  id: number;
  name: string;
  company: string;
  email: string;
  location: string;
  phone: string;
  status: 'active' | 'trial' | 'churned';
  /** A portrait, if the customer has one; otherwise their initials show. */
  photo?: string;
  /** Their company's logo, if it has one. */
  logo?: ShowcaseLogoName;
}

export interface Order {
  id: string;
  date: Date;
  customer: string;
  status: 'completed' | 'pending' | 'cancelled';
  total: number;
}

/** A customer's portrait, if they have one. */
export const photoOf = (name: string) => CUSTOMERS.find((customer) => customer.name === name)?.photo;

export const ORDER_STATUS: Record<Order['status'], NbComponentStatus> = {
  completed: 'success',
  pending: 'warning',
  cancelled: 'danger',
};

export const CUSTOMER_STATUS: Record<Customer['status'], NbComponentStatus> = {
  active: 'success',
  trial: 'info',
  churned: 'basic',
};

export const CUSTOMERS: Customer[] = [
  { id: 1, name: 'Jane Doe', company: 'Northwind Traders', email: 'jane.doe@example.com', location: 'London, UK', phone: '+44 20 7946 0018', status: 'active', photo: portrait('Jane Doe'), logo: 'northwind' },
  { id: 2, name: 'John Smith', company: 'Contoso Ltd', email: 'john.smith@example.com', location: 'Austin, US', phone: '+1 512 555 0142', status: 'active', photo: portrait('John Smith'), logo: 'contoso' },
  { id: 3, name: 'Emma Brown', company: 'Fabrikam', email: 'emma.brown@example.com', location: 'Leeds, UK', phone: '+44 113 496 0727', status: 'trial', photo: portrait('Emma Brown'), logo: 'fabrikam' },
  { id: 4, name: 'Olivia Wilson', company: 'Tailspin Toys', email: 'olivia.wilson@example.com', location: 'Denver, US', phone: '+1 303 555 0187', status: 'active', photo: portrait('Olivia Wilson'), logo: 'tailspin' },
  { id: 5, name: 'Liam Johnson', company: 'Litware Inc', email: 'liam.johnson@example.com', location: 'Seattle, US', phone: '+1 206 555 0110', status: 'churned', logo: 'litware' },
  { id: 6, name: 'Sophie Taylor', company: 'Adventure Works', email: 'sophie.taylor@example.com', location: 'Bristol, UK', phone: '+44 117 496 0503', status: 'trial', photo: portrait('Sophie Taylor'), logo: 'adventure-works' },
  { id: 7, name: 'Noah Davis', company: 'Proseware', email: 'noah.davis@example.com', location: 'Chicago, US', phone: '+1 312 555 0164', status: 'active', photo: portrait('Noah Davis'), logo: 'proseware' },
  { id: 8, name: 'Mia Clarke', company: 'Wingtip Toys', email: 'mia.clarke@example.com', location: 'Glasgow, UK', phone: '+44 141 496 0912', status: 'active', photo: portrait('Mia Clarke') },
];

const day = (days: number, hours = 9) => new Date(2026, 5, 1 + days, hours, 30);

export const ORDERS: Order[] = [
  { id: 'SO-1042', date: day(14, 17), customer: 'Jane Doe', status: 'completed', total: 104.98 },
  { id: 'SO-1041', date: day(14, 16), customer: 'John Smith', status: 'completed', total: 233 },
  { id: 'SO-1040', date: day(14, 15), customer: 'Emma Brown', status: 'pending', total: 150.1 },
  { id: 'SO-1039', date: day(13, 12), customer: 'Olivia Wilson', status: 'completed', total: 170.25 },
  { id: 'SO-1038', date: day(13, 8), customer: 'Liam Johnson', status: 'cancelled', total: 199.99 },
];

export const EVENTS = [
  { date: day(16), title: 'Quarterly review with Northwind' },
  { date: day(17, 11), title: 'Product demo for Fabrikam' },
  { date: day(18, 14), title: 'Team planning' },
  { date: day(21, 10), title: 'Renewal call with Contoso' },
];

export const TOP_PRODUCTS = [
  { name: 'Team plan, yearly', sold: 214, revenue: 25680 },
  { name: 'Starter plan, monthly', sold: 640, revenue: 9600 },
  { name: 'Onboarding package', sold: 38, revenue: 7600 },
  { name: 'Extra storage, 1 TB', sold: 155, revenue: 3100 },
];
