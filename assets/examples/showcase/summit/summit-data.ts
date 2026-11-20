import { NbComponentStatus } from '@liquid-js/lyr-core'

import { ShowcaseLogoName } from '../shared/showcase-logos'

/** The conference: two days in Austin. */
export const SUMMIT = {
    name: 'Summit',
    year: 2027,
    dates: '22–23 April 2027',
    city: 'Austin, TX',
    venue: 'Riverside Convention Centre',
    address: '500 E Cesar Chavez St, Austin, TX 78701',
    tagline: 'Product and design, in the same room.'
}

export const SUMMIT_STATS = [
    { value: '48', label: 'Speakers' },
    { value: '32', label: 'Talks and workshops' },
    { value: '1,800', label: 'Attendees' },
    { value: '2', label: 'Days' }
]

export interface SummitSpeaker {
    id: string
    name: string
    role: string
    company: string
    topics: string[]
    bio: string
    /** The session they give, by its id. */
    session?: string
    featured?: boolean
}

export const SUMMIT_SPEAKERS: SummitSpeaker[] = [
    {
        id: 'jane-doe',
        name: 'Jane Doe',
        role: 'VP of Product',
        company: 'Northwind',
        topics: ['Strategy', 'Leadership'],
        bio: 'Jane runs product at Northwind, where she took a 40-person team from quarterly releases to shipping every day. Before that she led growth at two early-stage companies and wrote the book nobody asked for on roadmaps.',
        session: 'd1-keynote',
        featured: true
    },
    {
        id: 'emma-brown',
        name: 'Emma Brown',
        role: 'Head of Design',
        company: 'Contoso',
        topics: ['Design systems', 'Teams'],
        bio: 'Emma built Contoso’s design system twice: once that didn’t survive a reorg, and once that did. She talks about the second one, and what the first one taught her.',
        session: 'd1-systems',
        featured: true
    },
    {
        id: 'noah-davis',
        name: 'Noah Davis',
        role: 'Staff Engineer',
        company: 'Fabrikam',
        topics: ['Delivery', 'Platform'],
        bio: 'Noah keeps Fabrikam’s release trains on time. He has strong opinions about Monday deploys and the data to back them up.',
        session: 'd1-trains',
        featured: true
    },
    {
        id: 'olivia-wilson',
        name: 'Olivia Wilson',
        role: 'Product Lead, Pricing',
        company: 'Tailspin',
        topics: ['Pricing', 'Growth'],
        bio: 'Olivia has repriced three products and lived to tell the tale. Her talks are the ones with the most screenshots of spreadsheets.',
        session: 'd1-pricing',
        featured: true
    },
    {
        id: 'sophie-taylor',
        name: 'Sophie Taylor',
        role: 'Principal Designer',
        company: 'Litware',
        topics: ['Typography', 'Motion'],
        bio: 'Sophie designs the parts of Litware people notice without knowing why: the type, the timing and the small moves between screens.',
        session: 'd1-type'
    },
    {
        id: 'mia-clarke',
        name: 'Mia Clarke',
        role: 'Product Manager',
        company: 'Proseware',
        topics: ['Research', 'Writing'],
        bio: 'Mia writes the clearest product briefs in the business, and runs the workshop that teaches you to do it in forty minutes.',
        session: 'd1-brief'
    },
    {
        id: 'john-smith',
        name: 'John Smith',
        role: 'Co-founder',
        company: 'Northwind',
        topics: ['Founding', 'AI'],
        bio: 'John co-founded Northwind and now spends his time on the second product, which he says is harder than the first.',
        session: 'd2-keynote',
        featured: true
    },
    {
        id: 'liam-johnson',
        name: 'Liam Johnson',
        role: 'Engineering Manager',
        company: 'Contoso',
        topics: ['Web platform', 'Performance'],
        bio: 'Liam looks after the edge at Contoso and measures everything in milliseconds and dollars.',
        session: 'd1-edge'
    },
    {
        id: 'ava-martin',
        name: 'Ava Martin',
        role: 'Design Director',
        company: 'Fabrikam',
        topics: ['Critique', 'AI'],
        bio: 'Ava runs design reviews at Fabrikam and has rewritten how they work twice since the tools changed.',
        session: 'd1-panel'
    },
    {
        id: 'ethan-brooks',
        name: 'Ethan Brooks',
        role: 'Platform Engineer',
        company: 'Tailspin',
        topics: ['Observability', 'Data'],
        bio: 'Ethan builds the dashboards product people actually open, and explains what the numbers on them mean.',
        session: 'd2-observability'
    },
    {
        id: 'chloe-harris',
        name: 'Chloe Harris',
        role: 'Accessibility Lead',
        company: 'Litware',
        topics: ['Accessibility', 'Quality'],
        bio: 'Chloe has made accessibility part of the definition of done at three companies, and shows how to do it without a committee.',
        session: 'd2-a11y'
    }
]

export const speakerById = (id: string) => SUMMIT_SPEAKERS.find((speaker) => speaker.id === id)

export type SummitTrack = 'keynote' | 'product' | 'design' | 'engineering' | 'break'

/** Each track's colour, which its tags and timeline marks take. */
export const SUMMIT_TRACKS: Record<Exclude<SummitTrack, 'break'>, { label: string, status: NbComponentStatus }> = {
    keynote: { label: 'Keynote', status: 'primary' },
    product: { label: 'Product', status: 'info' },
    design: { label: 'Design', status: 'success' },
    engineering: { label: 'Engineering', status: 'warning' }
}

export interface SummitSession {
    id: string
    start: string
    end: string
    title: string
    track: SummitTrack
    room: string
    /** Speakers by their ids. */
    speakers: string[]
    summary?: string
}

export interface SummitDay {
    id: string
    label: string
    date: string
    sessions: SummitSession[]
}

export const SUMMIT_DAYS: SummitDay[] = [
    {
        id: 'day-1',
        label: 'Day 1',
        date: 'Wednesday 22 April',
        sessions: [
            { id: 'd1-reg', start: '08:00', end: '09:00', title: 'Registration and coffee', track: 'break', room: 'Lobby', speakers: [] },
            {
                id: 'd1-keynote',
                start: '09:00',
                end: '09:45',
                title: 'Build less, decide more',
                track: 'keynote',
                room: 'Main stage',
                speakers: ['jane-doe'],
                summary: 'Why the best product teams of the next five years will ship fewer things, and how they decide which.'
            },
            {
                id: 'd1-systems',
                start: '10:00',
                end: '10:40',
                title: 'Design systems that survive reorgs',
                track: 'design',
                room: 'Room A',
                speakers: ['emma-brown'],
                summary: 'Ownership, funding and the three documents that keep a system alive when the org chart changes.'
            },
            {
                id: 'd1-trains',
                start: '10:00',
                end: '10:40',
                title: 'Shipping on Mondays: release trains that work',
                track: 'engineering',
                room: 'Room B',
                speakers: ['noah-davis'],
                summary: 'A year of data from a team that deploys at 9am on Mondays, and what it did to incident rates.'
            },
            { id: 'd1-coffee', start: '10:45', end: '11:15', title: 'Coffee', track: 'break', room: 'Lobby', speakers: [] },
            {
                id: 'd1-pricing',
                start: '11:15',
                end: '11:55',
                title: 'Pricing is a product',
                track: 'product',
                room: 'Room A',
                speakers: ['olivia-wilson'],
                summary: 'Three repricings, the experiments behind them, and the one metric that predicted churn each time.'
            },
            {
                id: 'd1-type',
                start: '11:15',
                end: '11:55',
                title: 'Type at scale',
                track: 'design',
                room: 'Room B',
                speakers: ['sophie-taylor'],
                summary: 'A typographic system for a product with 400 screens: sizes, rhythm, and where to break the rules.'
            },
            { id: 'd1-lunch', start: '12:15', end: '13:30', title: 'Lunch', track: 'break', room: 'Terrace', speakers: [] },
            {
                id: 'd1-brief',
                start: '13:30',
                end: '14:45',
                title: 'Workshop: a product brief in forty minutes',
                track: 'product',
                room: 'Workshop room',
                speakers: ['mia-clarke'],
                summary: 'Bring a half-formed idea; leave with a one-page brief your team can argue with.'
            },
            {
                id: 'd1-edge',
                start: '13:30',
                end: '14:10',
                title: 'Edge-first rendering in 2027',
                track: 'engineering',
                room: 'Room B',
                speakers: ['liam-johnson'],
                summary: 'What moved to the edge, what came back, and the bill for both.'
            },
            {
                id: 'd1-panel',
                start: '15:00',
                end: '15:50',
                title: 'Panel: what AI changed in the design review',
                track: 'design',
                room: 'Main stage',
                speakers: ['ava-martin', 'john-smith'],
                summary: 'Two design leaders on critique, taste and the parts of the job that got harder.'
            },
            {
                id: 'd1-lightning',
                start: '16:15',
                end: '17:00',
                title: 'Lightning talks',
                track: 'product',
                room: 'Main stage',
                speakers: [],
                summary: 'Eight talks, five minutes each, chosen from the open call.'
            },
            { id: 'd1-party', start: '17:30', end: '20:00', title: 'Welcome party', track: 'break', room: 'Lobby', speakers: [] }
        ]
    },
    {
        id: 'day-2',
        label: 'Day 2',
        date: 'Thursday 23 April',
        sessions: [
            { id: 'd2-coffee-1', start: '08:30', end: '09:00', title: 'Coffee', track: 'break', room: 'Lobby', speakers: [] },
            {
                id: 'd2-keynote',
                start: '09:00',
                end: '09:45',
                title: 'The second product',
                track: 'keynote',
                room: 'Main stage',
                speakers: ['john-smith'],
                summary: 'Everything that made the first product work gets in the way of the second. A founder’s notes from the middle of it.'
            },
            {
                id: 'd2-a11y',
                start: '10:00',
                end: '10:40',
                title: 'Accessibility is a feature flag you can’t turn off',
                track: 'engineering',
                room: 'Room A',
                speakers: ['chloe-harris'],
                summary: 'How to make accessibility part of done, with the checks that run in CI and the ones that need a person.'
            },
            {
                id: 'd2-interviews',
                start: '10:00',
                end: '10:40',
                title: 'Interviewing without the script',
                track: 'product',
                room: 'Room B',
                speakers: ['mia-clarke'],
                summary: 'Customer interviews that find what you didn’t know to ask about.'
            },
            { id: 'd2-coffee-2', start: '10:45', end: '11:15', title: 'Coffee', track: 'break', room: 'Lobby', speakers: [] },
            {
                id: 'd2-motion',
                start: '11:15',
                end: '12:15',
                title: 'Workshop: motion that means something',
                track: 'design',
                room: 'Workshop room',
                speakers: ['sophie-taylor'],
                summary: 'Hands-on: timing, easing and the four moves that cover most of a product.'
            },
            {
                id: 'd2-observability',
                start: '11:15',
                end: '11:55',
                title: 'Observability for product people',
                track: 'engineering',
                room: 'Room B',
                speakers: ['ethan-brooks'],
                summary: 'The dashboards product managers open, and what the numbers on them are made of.'
            },
            { id: 'd2-lunch', start: '12:15', end: '13:30', title: 'Lunch', track: 'break', room: 'Terrace', speakers: [] },
            {
                id: 'd2-growth',
                start: '13:30',
                end: '14:10',
                title: 'Growth loops after the hype',
                track: 'product',
                room: 'Room A',
                speakers: ['olivia-wilson'],
                summary: 'Which loops still compound in a market that stopped growing, with numbers.'
            },
            {
                id: 'd2-small',
                start: '13:30',
                end: '14:10',
                title: 'Small teams, big surfaces',
                track: 'design',
                room: 'Room B',
                speakers: ['emma-brown'],
                summary: 'Running design for a product bigger than the team, without the team burning out.'
            },
            {
                id: 'd2-closing',
                start: '15:00',
                end: '15:50',
                title: 'Closing: ask us anything',
                track: 'keynote',
                room: 'Main stage',
                speakers: ['jane-doe', 'john-smith', 'emma-brown'],
                summary: 'The keynote speakers take questions from the room.'
            },
            { id: 'd2-drinks', start: '16:00', end: '18:00', title: 'Farewell drinks', track: 'break', room: 'Terrace', speakers: [] }
        ]
    }
]

export const sessionById = (id: string) =>
    SUMMIT_DAYS.flatMap((day) => day.sessions.map((session) => ({ day, session }))).find(
        ({ session }) => session.id === id
    )

export interface SummitTier {
    id: string
    name: string
    price: number
    note: string
    perks: string[]
    soldOut?: boolean
    highlighted?: boolean
}

export const SUMMIT_TIERS: SummitTier[] = [
    {
        id: 'early',
        name: 'Early bird',
        price: 390,
        note: 'Sold out in 9 days',
        perks: ['Both days', 'All talks and workshops', 'Lunch and coffee', 'Welcome party'],
        soldOut: true
    },
    {
        id: 'standard',
        name: 'Standard',
        price: 590,
        note: 'Until 31 March',
        perks: ['Both days', 'All talks and workshops', 'Lunch and coffee', 'Welcome party', 'Talk recordings'],
        highlighted: true
    },
    {
        id: 'team',
        name: 'Team',
        price: 490,
        note: 'Per ticket, five or more',
        perks: ['Everything in Standard', 'Reserved seating', 'A private room for an hour', 'Invoice billing']
    }
]

export const SUMMIT_SPONSORS: ShowcaseLogoName[] = ['northwind', 'contoso', 'fabrikam', 'tailspin', 'litware', 'proseware']

export const SUMMIT_HOTELS = [
    { name: 'The Lakeside', distance: '2 min walk', rate: 'from $210', code: 'SUMMIT27' },
    { name: 'Congress Avenue Hotel', distance: '8 min walk', rate: 'from $165', code: 'SUMMIT27' },
    { name: 'East Side Lofts', distance: '12 min by bike', rate: 'from $120', code: 'SUMMITLOFT' }
]

export const SUMMIT_FAQ = [
    {
        question: 'Can I get a refund?',
        answer: 'Full refunds until 31 March 2027. After that you can transfer your ticket to someone else at any time, free of charge.'
    },
    {
        question: 'Are the talks recorded?',
        answer: 'Yes. Standard and Team tickets include the recordings, available about two weeks after the conference.'
    },
    {
        question: 'Is lunch included?',
        answer: 'Lunch and coffee on both days are included, with vegetarian, vegan and gluten-free options. Tell us about allergies when you register.'
    },
    {
        question: 'Is the venue accessible?',
        answer: 'The whole venue is step-free, with hearing loops on the main stage and live captions for every talk. Write to us if you need anything else.'
    },
    {
        question: 'How do I apply to speak?',
        answer: 'The call for talks is open until 15 January. Lightning talks are chosen from the open call in March.'
    }
]
