import { NbComponentStatus } from '@liquid-js/lyr-core'

import { portrait } from '../shared/showcase-images'

export type Department = 'Engineering' | 'Design' | 'Sales' | 'Finance' | 'People' | 'Operations'
export type Office = 'London' | 'Austin' | 'Berlin' | 'Remote'

export interface Person {
    id: number
    name: string
    role: string
    department: Department
    office: Office
    email: string
    /** Who they report to, by id; none for the CEO. */
    managerId?: number
    photo?: string
}

export const DEPARTMENTS: Department[] = ['Engineering', 'Design', 'Sales', 'Finance', 'People', 'Operations']
export const OFFICES: Office[] = ['London', 'Austin', 'Berlin', 'Remote']

const email = (name: string) => `${name.toLowerCase().replace(/ /g, '.')}@example.com`
const person = (
    id: number,
    name: string,
    role: string,
    department: Department,
    office: Office,
    managerId?: number
): Person => ({ id, name, role, department, office, email: email(name), managerId, photo: portrait(name) })

export const PEOPLE: Person[] = [
    person(1, 'Olivia Wilson', 'Chief executive', 'Operations', 'London'),
    person(2, 'Jane Doe', 'Head of design', 'Design', 'London', 1),
    person(3, 'John Smith', 'Head of engineering', 'Engineering', 'Austin', 1),
    person(4, 'Emma Brown', 'Product designer', 'Design', 'Berlin', 2),
    person(5, 'Noah Davis', 'Design systems lead', 'Design', 'Remote', 2),
    person(6, 'Sophie Taylor', 'Head of people', 'People', 'London', 1),
    person(7, 'Mia Clarke', 'Finance manager', 'Finance', 'London', 1),
    person(8, 'Liam Johnson', 'Senior engineer', 'Engineering', 'Austin', 3),
    person(9, 'Ava Martin', 'Account executive', 'Sales', 'Austin', 1),
    person(10, 'Ethan Moore', 'Platform engineer', 'Engineering', 'Berlin', 3),
    person(11, 'Chloe Walker', 'UX researcher', 'Design', 'Remote', 2),
    person(12, 'Lucas Hall', 'IT support lead', 'Operations', 'London', 1),
    person(13, 'Grace Young', 'Sales manager', 'Sales', 'London', 1),
    person(14, 'Oliver King', 'Content designer', 'Design', 'Berlin', 5),
    person(15, 'Isla Wright', 'Payroll specialist', 'Finance', 'Remote', 7),
    person(16, 'Harry Green', 'Frontend engineer', 'Engineering', 'Remote', 8),
    person(17, 'Amelia Scott', 'People partner', 'People', 'Austin', 6),
    person(18, 'Jack Turner', 'Office manager', 'Operations', 'Berlin', 12)
]

export const personNamed = (name: string) => PEOPLE.find((item) => item.name === name)
export const photoOf = (name: string) => personNamed(name)?.photo

/** The day the examples are set on. */
export const TODAY = new Date(2026, 5, 17, 9, 15)
const at = (hours: number, minutes = 0, days = 0) =>
    new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + days, hours, minutes)

export interface Announcement {
    title: string
    text: string
    author: string
    date: Date
    tags: string[]
    image?: string
    pinned?: boolean
}

export const ANNOUNCEMENTS: Announcement[] = [
    {
        title: 'Summer offsite: Lisbon, 7 to 9 September',
        text: 'Three days of planning, workshops and time together. Flights and the hotel are booked by the People team; add your dietary needs and travel notes by Friday.',
        author: 'Sophie Taylor',
        date: at(8, 40),
        tags: ['Company', 'Events'],
        image: 'assets/showcase/hub/offsite.webp',
        pinned: true
    },
    {
        title: 'New expense policy from 1 July',
        text: 'Meals on travel days go up to £45, and receipts under £20 no longer need a photo. The policy page in Documents has the details and the new form.',
        author: 'Mia Clarke',
        date: at(16, 10, -1),
        tags: ['Finance', 'Policy']
    },
    {
        title: 'Design system 4.0 is live',
        text: 'The new tokens, components and icon set are in the shared library. Older files keep working; new work starts on 4.0.',
        author: 'Noah Davis',
        date: at(11, 0, -2),
        tags: ['Design', 'Engineering']
    }
]

export interface Event {
    time: Date
    title: string
    where: string
    /** Lasts the whole day. */
    allDay?: boolean
}

export const EVENTS: Event[] = [
    { time: at(9, 30), title: 'Design weekly', where: 'Room 2B, London' },
    { time: at(11, 0), title: 'Platform planning', where: 'Video call' },
    { time: at(13, 0), title: 'Lunch and learn: accessibility', where: 'Kitchen, London' },
    { time: at(15, 30), title: 'Quarterly review prep', where: 'Room 1A, London' },
    { time: at(0, 0), title: 'Payroll cut-off', where: 'Finance', allDay: true }
]

export interface FeedItem {
    author: string
    text: string
    date: Date
    icon: string
    status: NbComponentStatus
}

export const FEED: FeedItem[] = [
    { author: 'Harry Green', text: 'shipped the new onboarding flow to 10% of customers', date: at(8, 55), icon: 'rocket-outline', status: 'primary' },
    { author: 'Ava Martin', text: 'closed Northwind Traders, the biggest deal this quarter', date: at(8, 20), icon: 'award-outline', status: 'warning' },
    { author: 'Chloe Walker', text: 'published the Q2 research round-up in Documents', date: at(17, 45, -1), icon: 'file-text-outline', status: 'info' },
    { author: 'Lucas Hall', text: 'scheduled the laptop refresh for the Berlin office, 24 June', date: at(15, 30, -1), icon: 'monitor-outline', status: 'basic' },
    { author: 'Amelia Scott', text: 'welcomed Jack Turner to Operations', date: at(10, 5, -1), icon: 'people-outline', status: 'success' }
]

export interface Celebration {
    name: string
    what: string
    when: string
}

export const CELEBRATIONS: Celebration[] = [
    { name: 'Emma Brown', what: 'Birthday', when: 'Today' },
    { name: 'Jack Turner', what: 'Joined Operations', when: 'This week' },
    { name: 'Liam Johnson', what: '5 years at Acme', when: 'Thursday' },
    { name: 'Grace Young', what: 'Birthday', when: 'Friday' }
]

export interface Folder {
    name: string
    icon?: string
    children?: Folder[]
}

export const FOLDERS: Folder[] = [
    { name: 'Company', icon: 'home-outline', children: [{ name: 'Policies' }, { name: 'Handbook' }, { name: 'Brand' }] },
    { name: 'Marketing', icon: 'bulb-outline', children: [{ name: 'Campaigns' }, { name: 'Press' }] },
    { name: 'Finance', icon: 'credit-card-outline', children: [{ name: 'Reports' }, { name: 'Expenses' }] },
    { name: 'Engineering', icon: 'code-outline' },
    { name: 'Shared with me', icon: 'people-outline' }
]

export type FileKind = 'doc' | 'sheet' | 'slides' | 'pdf' | 'image'

export interface Document {
    id: number
    name: string
    kind: FileKind
    owner: string
    modified: Date
    /** In kilobytes. */
    size: number
}

export const FILE_ICONS: Record<FileKind, string> = {
    doc: 'file-text-outline',
    sheet: 'grid-outline',
    slides: 'monitor-outline',
    pdf: 'file-outline',
    image: 'image-outline'
}

export const DOCUMENTS: Document[] = [
    { id: 1, name: 'Q3 campaign plan', kind: 'doc', owner: 'Grace Young', modified: at(8, 50), size: 318 },
    { id: 2, name: 'Launch budget 2026', kind: 'sheet', owner: 'Mia Clarke', modified: at(17, 20, -1), size: 92 },
    { id: 3, name: 'Press kit', kind: 'pdf', owner: 'Oliver King', modified: at(14, 5, -2), size: 4180 },
    { id: 4, name: 'Website hero shots', kind: 'image', owner: 'Jane Doe', modified: at(10, 30, -3), size: 12600 },
    { id: 5, name: 'Partner deck, June', kind: 'slides', owner: 'Ava Martin', modified: at(9, 0, -4), size: 7350 },
    { id: 6, name: 'Brand voice guide', kind: 'doc', owner: 'Oliver King', modified: at(16, 45, -6), size: 240 },
    { id: 7, name: 'Event calendar', kind: 'sheet', owner: 'Sophie Taylor', modified: at(12, 10, -8), size: 64 },
    { id: 8, name: 'Newsletter template', kind: 'doc', owner: 'Chloe Walker', modified: at(11, 25, -12), size: 150 }
]

export type RequestKind = 'leave' | 'room' | 'equipment' | 'expense'
export type RequestStatus = 'approved' | 'pending' | 'declined'

export interface Request {
    kind: RequestKind
    title: string
    detail: string
    status: RequestStatus
}

export const REQUEST_STATUS: Record<RequestStatus, NbComponentStatus> = {
    approved: 'success',
    pending: 'warning',
    declined: 'danger'
}

export const REQUEST_KINDS: Array<{ value: RequestKind, title: string, text: string, icon: string }> = [
    { value: 'leave', title: 'Time off', text: 'Holiday, sick leave or a day for something else.', icon: 'sun-outline' },
    { value: 'room', title: 'Room', text: 'A meeting room or a desk in another office.', icon: 'calendar-outline' },
    { value: 'equipment', title: 'Equipment', text: 'A laptop, a monitor or anything else you need.', icon: 'monitor-outline' },
    { value: 'expense', title: 'Expense', text: 'Something you paid for and want back.', icon: 'credit-card-outline' }
]

export const REQUESTS: Request[] = [
    { kind: 'leave', title: 'Holiday, 20 to 31 July', detail: '8 days', status: 'approved' },
    { kind: 'room', title: 'Room 2B, 24 June', detail: '14:00 to 16:00', status: 'pending' },
    { kind: 'equipment', title: 'Second monitor', detail: 'Delivered to London', status: 'approved' },
    { kind: 'expense', title: 'Train to Leeds', detail: '£86.40', status: 'declined' }
]

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketColumn = 'open' | 'progress' | 'waiting' | 'done'

export interface Ticket {
    id: number
    title: string
    category: string
    priority: TicketPriority
    column: TicketColumn
    assignee?: string
    comments: number
}

export const PRIORITY_STATUS: Record<TicketPriority, NbComponentStatus> = {
    low: 'basic',
    medium: 'info',
    high: 'warning',
    urgent: 'danger'
}

export const TICKET_COLUMNS: Array<{ id: TicketColumn, title: string }> = [
    { id: 'open', title: 'Open' },
    { id: 'progress', title: 'In progress' },
    { id: 'waiting', title: 'Waiting' },
    { id: 'done', title: 'Done' }
]

export const TICKETS: Ticket[] = [
    { id: 1042, title: 'VPN drops every hour on the Berlin network', category: 'Network', priority: 'urgent', column: 'open', comments: 3 },
    { id: 1041, title: 'New starter laptop for Jack Turner', category: 'Hardware', priority: 'high', column: 'open', assignee: 'Lucas Hall', comments: 1 },
    { id: 1040, title: 'Access to the finance shared drive', category: 'Access', priority: 'medium', column: 'open', comments: 0 },
    { id: 1039, title: 'Meeting room screen shows no signal', category: 'Hardware', priority: 'high', column: 'progress', assignee: 'Lucas Hall', comments: 4 },
    { id: 1037, title: 'Password reset for the payroll system', category: 'Access', priority: 'medium', column: 'progress', assignee: 'Jack Turner', comments: 2 },
    { id: 1035, title: 'Keyboard keys sticking', category: 'Hardware', priority: 'low', column: 'waiting', assignee: 'Jack Turner', comments: 1 },
    { id: 1033, title: 'Calendar invites arrive an hour late', category: 'Software', priority: 'medium', column: 'waiting', assignee: 'Lucas Hall', comments: 6 },
    { id: 1031, title: 'Printer on floor 2 out of toner', category: 'Office', priority: 'low', column: 'done', assignee: 'Jack Turner', comments: 0 },
    { id: 1028, title: 'Upgrade design team to the new licence', category: 'Software', priority: 'medium', column: 'done', assignee: 'Lucas Hall', comments: 2 }
]

export interface Channel {
    name: string
    /** A direct message with one person, rather than a channel. */
    direct?: boolean
    unread?: number
}

export const CHANNELS: Channel[] = [
    { name: 'general', unread: 2 },
    { name: 'design' },
    { name: 'engineering', unread: 5 },
    { name: 'london-office' },
    { name: 'random' },
    { name: 'Emma Brown', direct: true, unread: 1 },
    { name: 'Lucas Hall', direct: true },
    { name: 'Sophie Taylor', direct: true }
]

export interface Message {
    sender: string
    text: string
    date: Date
    /** Sent by the user themselves. */
    reply?: boolean
}

export const MESSAGES: Message[] = [
    { sender: 'Sophie Taylor', text: 'Morning all. The offsite hotel is confirmed, details are on the home page.', date: at(8, 42) },
    { sender: 'John Smith', text: 'Great news. Is there room for the Austin team to arrive a day early?', date: at(8, 50) },
    { sender: 'Sophie Taylor', text: 'Yes, the hotel holds the rooms from the 6th. Add it to your travel notes.', date: at(8, 53) },
    { sender: 'Jane Doe', text: 'Will do. Who is running the Tuesday workshops?', date: at(9, 2), reply: true },
    { sender: 'Olivia Wilson', text: 'Noah and I take the morning, the afternoon is open for team sessions.', date: at(9, 8) }
]

export interface Notification {
    title: string
    description: string
    on: boolean
}

export const NOTIFICATIONS: Notification[] = [
    { title: 'Announcements', description: 'Company and office news, as they are posted.', on: true },
    { title: 'Requests', description: 'When a request of yours is approved or declined.', on: true },
    { title: 'Tickets', description: 'Replies on tickets you opened.', on: true },
    { title: 'Mentions', description: 'When someone mentions you in chat.', on: true },
    { title: 'Weekly digest', description: 'What happened this week, on Friday afternoon.', on: false }
]
