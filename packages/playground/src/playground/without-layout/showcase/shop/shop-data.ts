import { NbComponentStatus } from '@liquid-js/lyr-core'

import { productImage } from '../shared/showcase-images'

export interface ShopProduct {
    id: string
    name: string
    category: string
    price: number
    rating: number
    reviews: number
    /** A product photo; a product without one shows its icon. */
    image?: string
    icon: string
    badge?: { text: string, status: NbComponentStatus }
    description: string
    details: string[]
    /** The colours it comes in, the first chosen to start with. */
    colours: Array<{ name: string, value: string }>
}

export const SHOP_CATEGORIES = ['All', 'Bags', 'Shoes', 'Watches', 'Home', 'Accessories']

export const SHOP_PRODUCTS: ShopProduct[] = [
    {
        id: 'backpack',
        name: 'Leather backpack',
        category: 'Bags',
        price: 79,
        rating: 4,
        reviews: 128,
        image: productImage('backpack'),
        icon: 'briefcase-outline',
        badge: { text: 'New', status: 'success' },
        description:
            'A roomy everyday backpack in soft full-grain leather, with a padded sleeve for a 15" laptop and a hidden ' +
            'pocket for your passport.',
        details: ['Full-grain leather', '20 litres', 'Fits a 15" laptop', 'Two-year warranty'],
        colours: [
            { name: 'Tan', value: '#b5733d' },
            { name: 'Black', value: '#22252d' },
            { name: 'Olive', value: '#6b7046' }
        ]
    },
    {
        id: 'running-shoes',
        name: 'Running shoes',
        category: 'Shoes',
        price: 120,
        rating: 5,
        reviews: 342,
        image: productImage('running-shoes'),
        icon: 'activity-outline',
        description: 'Light, cushioned trainers for long runs, with a breathable knit upper and a grippy sole.',
        details: ['Knit upper', 'Recycled foam sole', '8 mm drop', 'Free returns'],
        colours: [
            { name: 'White', value: '#f2f2f2' },
            { name: 'Coral', value: '#f2665a' }
        ]
    },
    {
        id: 'watch',
        name: 'Smart watch',
        category: 'Watches',
        price: 249,
        rating: 4,
        reviews: 96,
        image: productImage('watch'),
        icon: 'clock-outline',
        badge: { text: 'Sale', status: 'danger' },
        description: 'Heart rate, sleep and workouts on a bright always-on screen, with a week of battery.',
        details: ['42 mm case', 'Water resistant to 50 m', '7-day battery', 'Works with iOS and Android'],
        colours: [
            { name: 'Silver', value: '#c9ccd1' },
            { name: 'Graphite', value: '#3d4048' }
        ]
    },
    {
        id: 'wallet',
        name: 'Leather wallet',
        category: 'Accessories',
        price: 45,
        rating: 3,
        reviews: 41,
        icon: 'credit-card-outline',
        description: 'A slim wallet with six card slots and a note pocket, which ages beautifully.',
        details: ['Vegetable-tanned leather', 'Six card slots', 'RFID blocking'],
        colours: [
            { name: 'Brown', value: '#7a4a2a' },
            { name: 'Black', value: '#22252d' }
        ]
    },
    {
        id: 'mug',
        name: 'Classic mug',
        category: 'Home',
        price: 24,
        rating: 5,
        reviews: 210,
        image: productImage('mug'),
        icon: 'droplet-outline',
        description: 'A sturdy stoneware mug that keeps your coffee warm, safe in the dishwasher and microwave.',
        details: ['Stoneware', '350 ml', 'Dishwasher safe'],
        colours: [
            { name: 'White', value: '#f2f2f2' },
            { name: 'Sage', value: '#a3b8a0' }
        ]
    },
    {
        id: 'headphones',
        name: 'Wireless headphones',
        category: 'Accessories',
        price: 99,
        rating: 4,
        reviews: 187,
        image: productImage('headphones'),
        icon: 'headphones-outline',
        badge: { text: 'New', status: 'success' },
        description: 'Noise-cancelling over-ear headphones with rich sound, soft ear cushions and 30 hours of play.',
        details: ['Active noise cancelling', '30-hour battery', 'USB-C fast charging'],
        colours: [
            { name: 'Black', value: '#22252d' },
            { name: 'Sand', value: '#d8c8b0' }
        ]
    },
    {
        id: 'tote',
        name: 'Canvas tote',
        category: 'Bags',
        price: 32,
        rating: 4,
        reviews: 64,
        icon: 'shopping-bag-outline',
        description: 'A heavy canvas tote for the market or the beach, with an inside pocket and long handles.',
        details: ['Organic cotton canvas', 'Inside zip pocket', 'Machine washable'],
        colours: [{ name: 'Natural', value: '#e8dcc4' }]
    },
    {
        id: 'lamp',
        name: 'Desk lamp',
        category: 'Home',
        price: 65,
        rating: 5,
        reviews: 73,
        icon: 'bulb-outline',
        badge: { text: 'Sale', status: 'danger' },
        description: 'A dimmable LED desk lamp with a warm-to-cool light and an arm that goes where you need it.',
        details: ['Dimmable', 'Warm to cool light', 'USB charging port'],
        colours: [
            { name: 'White', value: '#f2f2f2' },
            { name: 'Black', value: '#22252d' }
        ]
    },
    {
        id: 'notebook',
        name: 'Dotted notebook',
        category: 'Accessories',
        price: 18,
        rating: 4,
        reviews: 152,
        icon: 'book-open-outline',
        description: 'A lay-flat A5 notebook with 160 pages of smooth, ink-friendly dotted paper.',
        details: ['A5', '160 pages', '100 gsm paper'],
        colours: [
            { name: 'Navy', value: '#2b3a67' },
            { name: 'Rust', value: '#b4532a' }
        ]
    },
    {
        id: 'sunglasses',
        name: 'Polarised sunglasses',
        category: 'Accessories',
        price: 59,
        rating: 4,
        reviews: 88,
        icon: 'sun-outline',
        description: 'Lightweight acetate frames with polarised lenses that cut the glare on water and roads.',
        details: ['Polarised lenses', 'UV400 protection', 'Hard case included'],
        colours: [
            { name: 'Tortoiseshell', value: '#7a4e2d' },
            { name: 'Black', value: '#22252d' }
        ]
    },
    {
        id: 'speaker',
        name: 'Portable speaker',
        category: 'Home',
        price: 79,
        rating: 4,
        reviews: 119,
        icon: 'speaker-outline',
        badge: { text: 'New', status: 'success' },
        description: 'A splash-proof speaker with big sound for its size and 12 hours of music on a charge.',
        details: ['Splash-proof', '12-hour battery', 'Pairs with a second speaker'],
        colours: [
            { name: 'Blue', value: '#3d5a99' },
            { name: 'Grey', value: '#8a8f99' }
        ]
    },
    {
        id: 'phone-case',
        name: 'Leather phone case',
        category: 'Accessories',
        price: 35,
        rating: 4,
        reviews: 57,
        icon: 'smartphone-outline',
        description: 'A slim leather case that wraps your phone without the bulk, with raised edges for the screen.',
        details: ['Full-grain leather', 'Wireless charging friendly', 'Microfibre lining'],
        colours: [
            { name: 'Tan', value: '#b5733d' },
            { name: 'Navy', value: '#2b3a67' }
        ]
    },
    {
        id: 'camera-strap',
        name: 'Camera strap',
        category: 'Accessories',
        price: 28,
        rating: 5,
        reviews: 34,
        icon: 'camera-outline',
        description: 'A woven cotton strap with leather ends, comfortable for a full day of shooting.',
        details: ['Woven cotton', 'Adjustable length', 'Fits most cameras'],
        colours: [{ name: 'Sand', value: '#d8c8b0' }]
    },
    {
        id: 'umbrella',
        name: 'Compact umbrella',
        category: 'Accessories',
        price: 26,
        rating: 4,
        reviews: 92,
        icon: 'umbrella-outline',
        description: 'A wind-resistant umbrella that opens and closes with one button and fits in a bag.',
        details: ['Wind-resistant frame', 'Auto open and close', '27 cm folded'],
        colours: [
            { name: 'Black', value: '#22252d' },
            { name: 'Yellow', value: '#e8b931' }
        ]
    },
    {
        id: 'slippers',
        name: 'Wool slippers',
        category: 'Shoes',
        price: 48,
        rating: 5,
        reviews: 211,
        icon: 'thermometer-outline',
        description: 'Warm felted-wool slippers with a cushioned footbed and a grippy sole for around the house.',
        details: ['Felted wool', 'Cushioned footbed', 'Non-slip sole'],
        colours: [
            { name: 'Grey', value: '#8a8f99' },
            { name: 'Cream', value: '#efe6d4' }
        ]
    },
    {
        id: 'weekender',
        name: 'Weekend bag',
        category: 'Bags',
        price: 139,
        rating: 4,
        reviews: 46,
        icon: 'briefcase-outline',
        badge: { text: 'Sale', status: 'danger' },
        description: 'A roomy holdall for two or three days away, with a shoe pocket and a padded shoulder strap.',
        details: ['Waxed canvas', '40 litres', 'Separate shoe pocket'],
        colours: [
            { name: 'Olive', value: '#6b7046' },
            { name: 'Navy', value: '#2b3a67' }
        ]
    },
    {
        id: 'alarm-clock',
        name: 'Sunrise alarm clock',
        category: 'Home',
        price: 89,
        rating: 4,
        reviews: 140,
        icon: 'clock-outline',
        description: 'Wakes you gently with light that brightens like a sunrise, then birdsong or the radio.',
        details: ['Sunrise simulation', 'FM radio', 'Sunset mode for falling asleep'],
        colours: [{ name: 'White', value: '#f2f2f2' }]
    },
    {
        id: 'sports-watch',
        name: 'Sports watch',
        category: 'Watches',
        price: 179,
        rating: 4,
        reviews: 77,
        icon: 'compass-outline',
        description: 'GPS for runs, rides and swims, with a bright screen you can read in full sun.',
        details: ['Built-in GPS', 'Water resistant to 100 m', '14-day battery'],
        colours: [
            { name: 'Black', value: '#22252d' },
            { name: 'Coral', value: '#f2665a' }
        ]
    }
]

export const findProduct = (id: string | null | undefined) => SHOP_PRODUCTS.find((item) => item.id === id)

/** Standard delivery is free on orders of at least this much. */
export const FREE_DELIVERY_FROM = 50

export type ShopDeliveryOption = 'standard' | 'express'

/** The delivery options at checkout. */
export const SHOP_DELIVERY: Array<{ id: ShopDeliveryOption, name: string, time: string }> = [
    { id: 'standard', name: 'Standard', time: '3–5 working days' },
    { id: 'express', name: 'Express', time: 'Next working day' }
]

/** What delivery costs: standard is free from $50, express is always $9. */
export const deliveryPrice = (option: ShopDeliveryOption, subtotal: number) =>
    option === 'express' ? 9 : subtotal >= FREE_DELIVERY_FROM ? 0 : 5

export type ShopOrderStatus = 'Processing' | 'Shipped' | 'Delivered'

export interface ShopOrder {
    number: string
    date: Date
    status: ShopOrderStatus
    lines: Array<{ product: ShopProduct, colour: string, quantity: number }>
    delivery: number
}

const product = (id: string) => SHOP_PRODUCTS.find((item) => item.id === id) ?? SHOP_PRODUCTS[0]

/** The orders the customer placed before, newest first. */
export const SHOP_PAST_ORDERS: ShopOrder[] = [
    {
        number: '10482',
        date: new Date(2026, 9, 28),
        status: 'Shipped',
        lines: [
            { product: product('headphones'), colour: 'Black', quantity: 1 },
            { product: product('notebook'), colour: 'Navy', quantity: 2 }
        ],
        delivery: 9
    },
    {
        number: '10391',
        date: new Date(2026, 8, 14),
        status: 'Delivered',
        lines: [{ product: product('running-shoes'), colour: 'Coral', quantity: 1 }],
        delivery: 0
    },
    {
        number: '10237',
        date: new Date(2026, 6, 2),
        status: 'Delivered',
        lines: [
            { product: product('mug'), colour: 'Sage', quantity: 4 },
            { product: product('lamp'), colour: 'White', quantity: 1 },
            { product: product('tote'), colour: 'Natural', quantity: 1 }
        ],
        delivery: 0
    }
]

export const orderTotal = (order: Pick<ShopOrder, 'lines' | 'delivery'>) =>
    order.lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0) + order.delivery

export const ORDER_STATUS: Record<ShopOrderStatus, NbComponentStatus> = {
    Processing: 'warning',
    Shipped: 'info',
    Delivered: 'success'
}
