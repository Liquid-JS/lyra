import { ShowcaseLogoName } from '../shared/showcase-logos'

// The site's pictures, served from the app's assets; their sources and licences are in CREDITS.md there.
const ROOT = 'assets/showcase/portfolio'
export const picture = (file: string) => `${ROOT}/${file}.webp`

/** The photographer. */
export const PHOTOGRAPHER = {
    name: 'Emma Brown',
    role: 'Architecture & portrait photographer',
    city: 'London',
    statement: 'I photograph buildings the way they are lived in, and people the way they are.',
    availability: 'Booking commissions for spring 2027',
    email: 'studio@emmabrown.example',
    phone: '+44 20 7946 0123',
    address: ['Studio 4, 14 Charterhouse Lane', 'London EC1M 6HN'],
    hours: ['Monday to Thursday, 9:00 to 18:00', 'Friday, by appointment'],
    socials: [
        { name: 'Instagram', handle: '@emmabrown.photo' },
        { name: 'Behance', handle: 'emmabrown' },
        { name: 'LinkedIn', handle: 'emma-brown-photo' }
    ]
}

/** A picture in the home page's grid: its file, what it shows, and how much of the grid it takes. */
export interface GridPicture {
    file: string
    alt: string
    title: string
    client: string
    /** Columns and rows it spans, of six columns; on a phone, wide ones take the two columns. */
    columns: 2 | 4
    rows: 1 | 2
}

export const GRID: GridPicture[] = [
    { file: 'curves', alt: 'Curved white walls under soft daylight', title: 'Concrete & light', client: 'Northwind HQ', columns: 4, rows: 2 },
    { file: 'stairs-white', alt: 'White concrete stairs turning a corner', title: 'The long stair', client: 'Contoso Foundation', columns: 2, rows: 2 },
    { file: 'geometry', alt: 'A facade of sharp geometry in light and shadow', title: 'Noon', client: 'Fabrikam Studios', columns: 2, rows: 1 },
    { file: 'steps-shadow', alt: 'Branch shadows across textured concrete steps', title: 'Branches', client: 'Tailspin Gardens', columns: 2, rows: 2 },
    { file: 'staircase-wood', alt: 'A modern wooden staircase from above', title: 'Spruce', client: 'Litware Offices', columns: 2, rows: 1 },
    { file: 'portrait-noah', alt: 'A man in a black crew-neck shirt, looking at the camera', title: 'Noah', client: 'Portrait series', columns: 2, rows: 1 },
    { file: 'curve-concrete', alt: 'A curved concrete structure in black and white', title: 'Sweep', client: 'Proseware Arena', columns: 2, rows: 1 },
    { file: 'shadow-facade', alt: 'The shadow of a building falling across its own side', title: 'Self-portrait of a house', client: 'Private residence', columns: 2, rows: 1 },
    { file: 'portrait-mia', alt: 'A black and white portrait of a woman', title: 'Mia', client: 'Portrait series', columns: 2, rows: 1 },
    { file: 'spiral', alt: 'A spiral staircase seen from above', title: 'Turn', client: 'Contoso Foundation', columns: 2, rows: 1 }
]

/** The clients whose logos the home page shows. */
export const CLIENTS: Array<{ name: string, logo: ShowcaseLogoName }> = [
    { name: 'Northwind', logo: 'northwind' },
    { name: 'Contoso', logo: 'contoso' },
    { name: 'Fabrikam', logo: 'fabrikam' },
    { name: 'Tailspin', logo: 'tailspin' },
    { name: 'Litware', logo: 'litware' },
    { name: 'Proseware', logo: 'proseware' }
]

/** The project the work page shows. */
export const PROJECT = {
    index: '01',
    title: 'Concrete & light',
    subtitle: 'Northwind’s new headquarters, photographed over four seasons',
    meta: [
        ['Client', 'Northwind'],
        ['Year', '2026'],
        ['Location', 'Rotterdam'],
        ['Role', 'Architecture photography'],
        ['Architects', 'Fabrikam Studios']
    ],
    lead: { file: 'stairway', alt: 'An empty stairway inside the building, lit from a window above' },
    text: [
        'Northwind asked for a record of the building as it was handed over, before the desks arrived. We agreed on something slower: four visits, one a season, following the light as it moved through the atrium.',
        'The building is mostly concrete and glass, so the pictures are mostly about edges: where a wall meets the floor, where a shadow meets a step. Nothing was staged, and no one was asked to leave; the people in the frames are the people who were there.',
        'The series was shown at the opening and now hangs along the atrium’s stair, one picture per landing.'
    ],
    gallery: [
        { file: 'tower', alt: 'The building seen from below, against the sky' },
        { file: 'spiral', alt: 'A spiral staircase seen from above' },
        { file: 'stairs-grey', alt: 'Grey concrete stairs in flat light' },
        { file: 'wall', alt: 'A white painted wall with a single shadow' }
    ],
    previous: { index: '12', title: 'Self-portrait of a house' },
    next: { index: '02', title: 'The long stair' }
}

/** The about page's CV. */
export interface CvSection {
    title: string
    entries: Array<{ years: string, text: string, where?: string }>
}

export const BIO = [
    'Emma Brown is an architecture and portrait photographer based in London. She trained as an architect, practised for six years, and has photographed buildings and the people who use them since 2016.',
    'Her work sits between documentation and portraiture: a building as a place where things happen, and a person as someone with somewhere to be. She works with architects, developers and magazines across the UK and Europe, and teaches a short course on photographing space at the Royal College.'
]

export const QUOTE = {
    text: 'Emma sees a building the way we hoped people would use it, and then shows us that they do.',
    author: 'John Smith',
    role: 'Partner, Fabrikam Studios'
}

export const CV: CvSection[] = [
    {
        title: 'Experience',
        entries: [
            { years: '2016 –', text: 'Independent photographer', where: 'London' },
            { years: '2019 –', text: 'Visiting tutor, Photographing Space', where: 'Royal College' },
            { years: '2010 – 2016', text: 'Architect', where: 'Fabrikam Studios' }
        ]
    },
    {
        title: 'Exhibitions',
        entries: [
            { years: '2026', text: 'Concrete & light', where: 'Northwind HQ, Rotterdam' },
            { years: '2024', text: 'Edges', where: 'Contoso Foundation gallery' },
            { years: '2022', text: 'Group show: New Ground', where: 'Tailspin Gardens' }
        ]
    },
    {
        title: 'Awards & press',
        entries: [
            { years: '2025', text: 'Architecture photographer of the year, shortlist' },
            { years: '2023', text: 'Portfolio feature', where: 'Litware magazine' },
            { years: '2021', text: 'Emerging talent award', where: 'Proseware Prize' }
        ]
    }
]

export const SERVICES = ['Architecture', 'Interiors', 'Portraits', 'Editorial', 'Construction progress', 'Prints', 'Workshops']

/** What a commission might be, for the contact form. */
export const PROJECT_TYPES = ['Architecture', 'Interiors', 'Portraits', 'Editorial', 'Something else']
export const BUDGETS = ['Under £2,000', '£2,000 to £5,000', '£5,000 to £15,000', 'Over £15,000', 'Not sure yet']
