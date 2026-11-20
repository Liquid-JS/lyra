import { NbComponentStatus } from '@liquid-js/lyr-core'

// The showcase's photos, under the app's assets; their sources are in CREDITS.md there.
export const stayImage = (file: string) => `assets/showcase/stay/${file}.webp`

export type StayType = 'Cabin' | 'Cottage' | 'Apartment' | 'Beach house' | 'Lodge'
export type StayFeature = 'Pet friendly' | 'Hot tub' | 'Lakefront' | 'Beach' | 'Fireplace' | 'Wifi' | 'Parking'

export interface StayListing {
    id: string
    name: string
    place: string
    region: string
    type: StayType
    image: string
    /** Per night. */
    price: number
    rating: number
    reviews: number
    guests: number
    bedrooms: number
    beds: number
    baths: number
    features: StayFeature[]
    host: string
    badge?: { text: string, status: NbComponentStatus }
}

export interface StayReview {
    name: string
    date: string
    rating: number
    text: string
}

export interface StayTrip {
    id: string
    listing: StayListing
    checkIn: Date
    checkOut: Date
    guests: number
    status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled'
    reference: string
}

export const STAY_TYPES: StayType[] = ['Cabin', 'Cottage', 'Apartment', 'Beach house', 'Lodge']
export const STAY_FEATURES: StayFeature[] = ['Pet friendly', 'Hot tub', 'Lakefront', 'Beach', 'Fireplace', 'Wifi', 'Parking']
export const STAY_PRICE_RANGE = { min: 50, max: 500 }
export const STAY_CLEANING_FEE = 45
export const STAY_SERVICE_FEE_RATE = 0.12

/** The places the search suggests. */
export const STAY_PLACES = [
    'Asheville, North Carolina',
    'Cape Cod, Massachusetts',
    'Colorado',
    'Cornwall',
    'Cotswolds',
    'Edinburgh',
    'Florida Keys',
    'Lake District, Cumbria',
    'Manchester',
    'Oregon',
    'Scottish Highlands',
    'Vermont'
]

export const STAY_LISTINGS: StayListing[] = [
    {
        id: 'creekside-cabin',
        name: 'Creekside Cabin',
        place: 'Asheville',
        region: 'North Carolina',
        type: 'Cabin',
        image: stayImage('cabin-deck'),
        price: 185,
        rating: 4.9,
        reviews: 212,
        guests: 4,
        bedrooms: 2,
        beds: 3,
        baths: 1,
        features: ['Fireplace', 'Hot tub', 'Wifi', 'Parking', 'Pet friendly'],
        host: 'Noah Davis',
        badge: { text: 'Guest favourite', status: 'warning' }
    },
    {
        id: 'sunlit-a-frame',
        name: 'Sunlit A-Frame',
        place: 'Bend',
        region: 'Oregon',
        type: 'Cabin',
        image: stayImage('aframe'),
        price: 140,
        rating: 4.8,
        reviews: 96,
        guests: 2,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        features: ['Fireplace', 'Wifi', 'Parking'],
        host: 'Sophie Taylor',
        badge: { text: 'Rare find', status: 'danger' }
    },
    {
        id: 'pine-hollow',
        name: 'Pine Hollow Hut',
        place: 'Stowe',
        region: 'Vermont',
        type: 'Cabin',
        image: stayImage('cabin-pines'),
        price: 95,
        rating: 4.7,
        reviews: 58,
        guests: 2,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        features: ['Fireplace', 'Pet friendly', 'Parking'],
        host: 'John Smith'
    },
    {
        id: 'lakeside-house',
        name: 'Lakeside House',
        place: 'Lake Placid',
        region: 'New York',
        type: 'Lodge',
        image: stayImage('lake-house'),
        price: 420,
        rating: 5,
        reviews: 41,
        guests: 8,
        bedrooms: 4,
        beds: 5,
        baths: 3,
        features: ['Lakefront', 'Hot tub', 'Fireplace', 'Wifi', 'Parking'],
        host: 'Olivia Wilson',
        badge: { text: 'New', status: 'success' }
    },
    {
        id: 'seabreeze-cottage',
        name: 'Seabreeze Cottage',
        place: 'Nantucket',
        region: 'Massachusetts',
        type: 'Beach house',
        image: stayImage('beach-house'),
        price: 310,
        rating: 4.8,
        reviews: 134,
        guests: 6,
        bedrooms: 3,
        beds: 4,
        baths: 2,
        features: ['Beach', 'Wifi', 'Parking', 'Pet friendly'],
        host: 'Mia Clarke'
    },
    {
        id: 'dune-house',
        name: 'Dune House',
        place: 'Cape Cod',
        region: 'Massachusetts',
        type: 'Beach house',
        image: stayImage('dune-house'),
        price: 365,
        rating: 4.9,
        reviews: 77,
        guests: 8,
        bedrooms: 4,
        beds: 6,
        baths: 3,
        features: ['Beach', 'Wifi', 'Parking', 'Fireplace'],
        host: 'Emma Brown',
        badge: { text: 'Guest favourite', status: 'warning' }
    },
    {
        id: 'clifftop-white-house',
        name: 'Clifftop White House',
        place: 'St Ives',
        region: 'Cornwall',
        type: 'Cottage',
        image: stayImage('white-house'),
        price: 275,
        rating: 4.9,
        reviews: 163,
        guests: 5,
        bedrooms: 3,
        beds: 3,
        baths: 2,
        features: ['Beach', 'Wifi', 'Parking'],
        host: 'Mia Clarke'
    },
    {
        id: 'boathouse-retreat',
        name: 'Boathouse Retreat',
        place: 'Loch Lomond',
        region: 'Scottish Highlands',
        type: 'Lodge',
        image: stayImage('boathouse'),
        price: 230,
        rating: 4.7,
        reviews: 49,
        guests: 6,
        bedrooms: 3,
        beds: 4,
        baths: 2,
        features: ['Lakefront', 'Fireplace', 'Pet friendly', 'Parking'],
        host: 'Noah Davis'
    },
    {
        id: 'hillside-lodge',
        name: 'Hillside Lodge',
        place: 'Estes Park',
        region: 'Colorado',
        type: 'Lodge',
        image: stayImage('hillside'),
        price: 260,
        rating: 4.8,
        reviews: 88,
        guests: 7,
        bedrooms: 3,
        beds: 5,
        baths: 2,
        features: ['Fireplace', 'Hot tub', 'Wifi', 'Parking', 'Pet friendly'],
        host: 'John Smith'
    },
    {
        id: 'green-sofa-loft',
        name: 'Green Sofa Loft',
        place: 'Ancoats',
        region: 'Manchester',
        type: 'Apartment',
        image: stayImage('apartment-green'),
        price: 120,
        rating: 4.6,
        reviews: 203,
        guests: 3,
        bedrooms: 1,
        beds: 2,
        baths: 1,
        features: ['Wifi'],
        host: 'Sophie Taylor'
    },
    {
        id: 'bright-corner-flat',
        name: 'Bright Corner Flat',
        place: 'Stockbridge',
        region: 'Edinburgh',
        type: 'Apartment',
        image: stayImage('apartment-light'),
        price: 135,
        rating: 4.8,
        reviews: 117,
        guests: 2,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        features: ['Wifi', 'Pet friendly'],
        host: 'Olivia Wilson',
        badge: { text: 'New', status: 'success' }
    },
    {
        id: 'palm-bedroom-studio',
        name: 'Palm Bedroom Studio',
        place: 'Islamorada',
        region: 'Florida Keys',
        type: 'Beach house',
        image: stayImage('bedroom-ocean'),
        price: 198,
        rating: 4.9,
        reviews: 65,
        guests: 2,
        bedrooms: 1,
        beds: 1,
        baths: 1,
        features: ['Beach', 'Wifi', 'Parking'],
        host: 'Emma Brown'
    }
]

/** The listing opened without one named: the first. */
export const STAY_FEATURED = STAY_LISTINGS[0]

/** A listing's inside, shared by all: the same cabin photos stand in for each place's own. */
export const STAY_GALLERY = [
    stayImage('interior-fire'),
    stayImage('interior-stove'),
    stayImage('interior-bed'),
    stayImage('patio-fire')
]

/** The featured listing's own large photo; the others show their card's. */
export const STAY_LARGE_PHOTOS: Record<string, string> = { 'creekside-cabin': stayImage('cabin-deck-large') }

export const STAY_HIGHLIGHTS = [
    {
        icon: 'home-outline',
        title: 'The whole place to yourself',
        text: 'You have the house, the deck and the garden; the host lives up the lane.'
    },
    { icon: 'unlock-outline', title: 'Self check-in', text: 'Let yourself in with the lockbox, any time after 3 pm.' },
    {
        icon: 'flame-outline',
        title: 'Wood-burning stove',
        text: 'Logs are stacked by the door; the stove heats the whole cabin in twenty minutes.'
    }
]

export const STAY_AMENITIES = [
    { icon: 'wifi-outline', name: 'Fast wifi, 240 Mbps' },
    { icon: 'flame-outline', name: 'Wood-burning stove' },
    { icon: 'droplet-outline', name: 'Hot tub on the deck' },
    { icon: 'tv-outline', name: '55" TV with streaming' },
    { icon: 'flame-outline', name: 'Fire pit and seating' },
    { icon: 'pin-outline', name: 'Free parking on site' },
    { icon: 'umbrella-outline', name: 'Covered porch' },
    { icon: 'shield-outline', name: 'Smoke and CO alarms' }
]

export const STAY_RULES = [
    {
        title: 'House rules',
        text: 'Check-in after 3 pm, check-out by 11 am. Up to four guests. Dogs welcome, with a heads-up. No parties or events, and quiet after 10 pm for the neighbours down the lane.'
    },
    {
        title: 'Safety and property',
        text: 'The creek runs past the deck and is deep after rain: keep an eye on children. The hot tub is 40 °C; the cover goes back on after use. No smoking inside.'
    },
    {
        title: 'Cancellation policy',
        text: 'Free cancellation up to 7 days before check-in. After that, the first night and the cleaning fee are kept; the rest is refunded.'
    }
]

export const STAY_REVIEWS: StayReview[] = [
    {
        name: 'Olivia Wilson',
        date: 'October 2026',
        rating: 5,
        text: 'The photos undersell it. We had coffee on the deck every morning listening to the creek, and the stove made the evenings cosy once it turned cold.'
    },
    {
        name: 'John Smith',
        date: 'September 2026',
        rating: 5,
        text: 'Spotless, well stocked, and Noah left a hand-drawn map of walks from the door. Fifteen minutes to town, but it feels a world away.'
    },
    {
        name: 'Mia Clarke',
        date: 'August 2026',
        rating: 4,
        text: 'Lovely cabin and a great hot tub. The wifi dropped once during a storm, which is the only reason this isn\'t five stars.'
    },
    {
        name: 'Jane Doe',
        date: 'July 2026',
        rating: 5,
        text: 'We came for two nights and wished we had booked a week. The bed is the comfiest I have slept in on a trip.'
    },
    {
        name: 'Emma Brown',
        date: 'June 2026',
        rating: 5,
        text: 'Quiet, warm and beautifully kept. The kitchen had everything we needed to cook properly, and the welcome basket was a lovely touch.'
    },
    {
        name: 'Noah Davis',
        date: 'May 2026',
        rating: 4,
        text: 'A great base for walking. The lane is steep and unlit, so arrive before dark, but once you are in it is perfect.'
    },
    {
        name: 'Sophie Taylor',
        date: 'April 2026',
        rating: 5,
        text: 'Our third stay, and still our favourite place to switch off. Bring a book and light the stove; that is the whole plan, and it works.'
    }
]

/** How the reviews rate the place, out of five. */
export const STAY_RATING_BREAKDOWN = [
    { label: 'Cleanliness', value: 4.9 },
    { label: 'Accuracy', value: 4.9 },
    { label: 'Check-in', value: 5 },
    { label: 'Communication', value: 5 },
    { label: 'Location', value: 4.7 },
    { label: 'Value', value: 4.8 }
]

const listing = (id: string): StayListing => {
    const found = STAY_LISTINGS.find((item) => item.id === id)
    if (!found) {
        throw new Error(`No listing ${id}`)
    }
    return found
}

export const STAY_TRIPS: StayTrip[] = [
    {
        id: 'trip-1',
        listing: listing('seabreeze-cottage'),
        checkIn: new Date(2026, 11, 18),
        checkOut: new Date(2026, 11, 22),
        guests: 4,
        status: 'Confirmed',
        reference: 'STY-4K2M9Q'
    },
    {
        id: 'trip-2',
        listing: listing('hillside-lodge'),
        checkIn: new Date(2027, 1, 12),
        checkOut: new Date(2027, 1, 16),
        guests: 6,
        status: 'Pending',
        reference: 'STY-7PX3LA'
    },
    {
        id: 'trip-3',
        listing: listing('bright-corner-flat'),
        checkIn: new Date(2026, 8, 4),
        checkOut: new Date(2026, 8, 7),
        guests: 2,
        status: 'Completed',
        reference: 'STY-2HD8ZT'
    },
    {
        id: 'trip-4',
        listing: listing('palm-bedroom-studio'),
        checkIn: new Date(2026, 4, 22),
        checkOut: new Date(2026, 4, 29),
        guests: 2,
        status: 'Completed',
        reference: 'STY-9RW5CE'
    },
    {
        id: 'trip-5',
        listing: listing('pine-hollow'),
        checkIn: new Date(2026, 2, 13),
        checkOut: new Date(2026, 2, 15),
        guests: 2,
        status: 'Cancelled',
        reference: 'STY-6QA1NV'
    }
]

/** Nights between two dates, by their days. */
export const nightsBetween = (checkIn: Date, checkOut: Date) =>
    Math.max(0, Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000))
