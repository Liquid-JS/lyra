import { NbComponentStatus } from '@liquid-js/lyr-core'

/** The example data Learn's screens show: the catalogue, one course in full, its lessons and a quiz. */

export type LearnLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type LearnCategory = 'Design' | 'Product' | 'Data' | 'Engineering'

export interface LearnCourse {
    id: string
    title: string
    subtitle: string
    category: LearnCategory
    level: LearnLevel
    hours: number
    lessons: number
    rating: number
    reviews: number
    price: number
    instructor: string
    /** How far the signed-in person is, when they're taking it. */
    progress?: number
}

export const LEARN_CATEGORIES: LearnCategory[] = ['Design', 'Product', 'Data', 'Engineering']
export const LEARN_LEVELS: LearnLevel[] = ['Beginner', 'Intermediate', 'Advanced']

export const LEARN_LEVEL_STATUS: Record<LearnLevel, NbComponentStatus> = {
    Beginner: 'success',
    Intermediate: 'info',
    Advanced: 'warning'
}

export const cover = (course: Pick<LearnCourse, 'id'>) => `assets/showcase/learn/${course.id}.webp`

export const LEARN_COURSES: LearnCourse[] = [
    {
        id: 'design-systems',
        title: 'Design Systems that Scale',
        subtitle: 'Tokens, components and governance for teams of ten to a thousand.',
        category: 'Design',
        level: 'Intermediate',
        hours: 12,
        lessons: 16,
        rating: 4.8,
        reviews: 1240,
        price: 89,
        instructor: 'Emma Brown',
        progress: 44
    },
    {
        id: 'data-analysis',
        title: 'Data Analysis with SQL',
        subtitle: 'From your first SELECT to window functions, on real product data.',
        category: 'Data',
        level: 'Beginner',
        hours: 10,
        lessons: 40,
        rating: 4.6,
        reviews: 1530,
        price: 79,
        instructor: 'John Smith',
        progress: 25
    },
    {
        id: 'product-design',
        title: 'Product Design Foundations',
        subtitle: 'Research, flows, wireframes and the handoff, end to end.',
        category: 'Design',
        level: 'Beginner',
        hours: 9,
        lessons: 36,
        rating: 4.7,
        reviews: 980,
        price: 69,
        instructor: 'Olivia Wilson'
    },
    {
        id: 'ux-research',
        title: 'UX Research in Practice',
        subtitle: 'Interviews, surveys and usability tests you can run next week.',
        category: 'Product',
        level: 'Intermediate',
        hours: 7,
        lessons: 28,
        rating: 4.9,
        reviews: 610,
        price: 79,
        instructor: 'Noah Davis'
    },
    {
        id: 'front-end',
        title: 'Front-end Engineering for Designers',
        subtitle: 'Enough HTML, CSS and components to build what you design.',
        category: 'Engineering',
        level: 'Advanced',
        hours: 14,
        lessons: 52,
        rating: 4.8,
        reviews: 720,
        price: 99,
        instructor: 'Mia Clarke'
    },
    {
        id: 'typography',
        title: 'Typography for Screens',
        subtitle: 'Type scales, pairing and rhythm that hold up at every size.',
        category: 'Design',
        level: 'Beginner',
        hours: 5,
        lessons: 20,
        rating: 4.9,
        reviews: 2100,
        price: 49,
        instructor: 'Sophie Taylor'
    },
    {
        id: 'motion-design',
        title: 'Motion Design for Interfaces',
        subtitle: 'Easing, timing and choreography that explain instead of decorate.',
        category: 'Design',
        level: 'Intermediate',
        hours: 8,
        lessons: 30,
        rating: 4.7,
        reviews: 440,
        price: 79,
        instructor: 'Jane Doe'
    },
    {
        id: 'product-strategy',
        title: 'Product Strategy and Roadmaps',
        subtitle: 'Choosing what to build, saying no, and telling the story.',
        category: 'Product',
        level: 'Advanced',
        hours: 6,
        lessons: 22,
        rating: 4.8,
        reviews: 380,
        price: 89,
        instructor: 'Emma Brown'
    },
    {
        id: 'illustration',
        title: 'Illustration for Interfaces',
        subtitle: 'Spot illustrations, empty states and icons in one consistent voice.',
        category: 'Design',
        level: 'Intermediate',
        hours: 6,
        lessons: 24,
        rating: 4.6,
        reviews: 290,
        price: 59,
        instructor: 'Olivia Wilson'
    }
]

/** The course the course, lesson and quiz screens show. */
export const LEARN_COURSE = LEARN_COURSES[0]

export interface LearnLesson {
    id: string
    title: string
    /** In minutes. */
    minutes: number
    done?: boolean
}

export interface LearnChapter {
    title: string
    lessons: LearnLesson[]
}

export const LEARN_CHAPTERS: LearnChapter[] = [
    {
        title: 'Foundations',
        lessons: [
            { id: 'why', title: 'Why design systems', minutes: 9, done: true },
            { id: 'tokens', title: 'Design tokens', minutes: 14, done: true },
            { id: 'scales', title: 'Colour and type scales', minutes: 18, done: true },
            { id: 'spacing', title: 'Spacing and layout', minutes: 12, done: true }
        ]
    },
    {
        title: 'Components',
        lessons: [
            { id: 'anatomy', title: 'Anatomy of a component', minutes: 11, done: true },
            { id: 'states', title: 'States and variants', minutes: 13, done: true },
            { id: 'accessibility', title: 'Accessibility by default', minutes: 16, done: true },
            { id: 'documentation', title: 'Documenting a component', minutes: 10 },
            { id: 'versioning', title: 'Versioning and change', minutes: 9 }
        ]
    },
    {
        title: 'Adoption',
        lessons: [
            { id: 'pilot', title: 'Running a pilot', minutes: 12 },
            { id: 'migration', title: 'Migrating an existing product', minutes: 17 },
            { id: 'contribution', title: 'A contribution model', minutes: 11 },
            { id: 'metrics', title: 'Measuring adoption', minutes: 8 }
        ]
    },
    {
        title: 'Governance',
        lessons: [
            { id: 'team', title: 'Staffing the system', minutes: 10 },
            { id: 'roadmap', title: 'The system roadmap', minutes: 12 },
            { id: 'sunset', title: 'Retiring what nobody uses', minutes: 7 }
        ]
    }
]

/** The lesson the player shows, in its chapter. */
export const LEARN_CHAPTER_INDEX = 1
export const LEARN_LESSON_INDEX = 3

export const LEARN_OUTCOMES = [
    'Set up a token pipeline that feeds design tools and code from one source',
    'Design components with every state, size and variant accounted for',
    'Write documentation people actually read',
    'Plan a migration from an existing product without stopping the roadmap',
    'Measure adoption and make the case for the team',
    'Run the system as a product, with a roadmap and a contribution model'
]

export interface LearnReview {
    name: string
    role: string
    rating: number
    date: string
    text: string
}

export const LEARN_REVIEWS: LearnReview[] = [
    {
        name: 'Olivia Wilson',
        role: 'Senior product designer',
        rating: 5,
        date: 'Oct 2026',
        text: 'The adoption chapter alone paid for the course. We used the pilot plan as written and had three teams on the system within a quarter.'
    },
    {
        name: 'Noah Davis',
        role: 'Front-end lead',
        rating: 5,
        date: 'Sep 2026',
        text: 'Finally a course that treats the engineering side as a first-class part of the system. The versioning lesson settled an argument we had been having for a year.'
    },
    {
        name: 'Sophie Taylor',
        role: 'Design manager',
        rating: 4,
        date: 'Aug 2026',
        text: 'Clear, practical and honest about the politics. I would have liked more on multi-brand systems, but what is here is excellent.'
    }
]

/** The lesson's notes, as markdown. */
export const LEARN_NOTES = `## Documenting a component

A component's page answers three questions, in this order: **when** to use it, **how** to use it, and **what** it can do.
Most documentation starts with the third and never gets to the first.

### Start with usage

- One sentence on what the component is for, and one on what it is not for.
- Two or three real examples from the product, not abstract ones.
- The alternatives: when a link beats a button, when a dialog beats a page.

### Then the anatomy

Name every part, because names are how designers and engineers talk to each other:

| Part | Required | Notes |
|---|---|---|
| Label | yes | Sentence case, verb first |
| Icon | no | Start or end, never both |
| Badge | no | Counts only, not status |

### Finally, the properties

List the inputs with their defaults, and show every state. If a state has no example, nobody will test it.

> Documentation is the interface of the system. If it is hard to use, the components are too.
`

export const LEARN_TRANSCRIPT = [
    { time: '0:00', text: "In this lesson we'll write the page for a component from scratch, and talk about why the order of the sections matters more than the sections themselves." },
    { time: '1:12', text: 'Most teams start with the properties table, because that is what the code gives you for free. But nobody opens the docs to learn the props; they open them to find out whether this is the right component.' },
    { time: '3:40', text: 'So the first section is usage: what it is for, what it is not for, and the alternatives. Two real examples beat ten abstract ones.' },
    { time: '6:05', text: 'Next, the anatomy. Name every part. The names end up in the code, in the design file, and in conversations, so pick them once and keep them.' },
    { time: '8:50', text: 'And then the properties, with every state shown. A state without an example is a state nobody will test.' }
]

export interface LearnQuestion {
    text: string
    options: string[]
    /** The right options' indexes; more than one for a question that asks for all that apply. */
    answers: number[]
    explanation: string
}

export const LEARN_QUIZ: LearnQuestion[] = [
    {
        text: 'What is a design token?',
        options: [
            'A named value, such as a colour or a size, shared by design tools and code',
            'A component in the design file',
            'A licence key for the design tool',
            'A unit of work on the system roadmap'
        ],
        answers: [0],
        explanation: 'Tokens are the smallest decisions in a system, named so that every tool and codebase uses the same value.'
    },
    {
        text: 'Which of these belong in the foundations of a system? Choose all that apply.',
        options: ['A colour scale', 'A type scale', 'A spacing scale', 'A pricing page'],
        answers: [0, 1, 2],
        explanation: 'Colour, type and spacing scales are the foundations every component builds on. A pricing page is a product page, not a foundation.'
    },
    {
        text: 'A type scale is best described as…',
        options: [
            'Every font size anyone has ever used in the product',
            'A small set of sizes with a consistent relationship between them',
            'The list of fonts licensed for the product',
            'The browser default sizes'
        ],
        answers: [1],
        explanation: 'A scale is a limited, related set of sizes. Limiting the set is what makes it a system.'
    },
    {
        text: 'Why does a spacing scale use a base unit, such as 4 or 8 pixels?',
        options: [
            'Because screens are measured in multiples of eight',
            'So that every gap, padding and size relates to the others and lines up',
            'Because the design tool requires it',
            'To make files smaller'
        ],
        answers: [1],
        explanation: 'A base unit keeps spacing consistent and makes alignment fall out naturally, rather than being tuned by hand.'
    },
    {
        text: 'Which token name follows the convention taught in the course?',
        options: ['blue-500', 'color-primary-500', 'brandBlueButton', 'primary'],
        answers: [1],
        explanation: 'Names say what a value is for (colour), which role it plays (primary) and which step it is (500), in that order.'
    },
    {
        text: 'What is the main risk of tokens that name a colour, such as "blue", rather than a role?',
        options: [
            'They are longer to type',
            'The name becomes wrong as soon as the brand colour changes',
            'Design tools cannot read them',
            'There is no risk'
        ],
        answers: [1],
        explanation: 'When the brand goes green, "blue" either lies or forces a rename everywhere. Role names survive the change.'
    },
    {
        text: 'Where should the single source of truth for tokens live?',
        options: [
            'In each product’s codebase',
            'In the design file only',
            'In one place that both the design tools and the codebases are generated from',
            'In a spreadsheet'
        ],
        answers: [2],
        explanation: 'One source, many outputs: that is what keeps design and code from drifting apart.'
    },
    {
        text: 'What does a line-height scale pair with?',
        options: ['The spacing scale, so text aligns to the grid', 'The colour scale', 'The icon set', 'Nothing; it is set per page'],
        answers: [0],
        explanation: 'Line heights that are multiples of the spacing unit keep text blocks on the same rhythm as everything else.'
    }
]
