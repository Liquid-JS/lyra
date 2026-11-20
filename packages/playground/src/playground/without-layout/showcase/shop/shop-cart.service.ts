import { computed, Injectable, signal } from '@angular/core'

import { findProduct, orderTotal, SHOP_PAST_ORDERS, ShopOrder, ShopProduct } from './shop-data'

export interface ShopCartLine {
    product: ShopProduct
    colour: string
    quantity: number
}

const sample = (id: string, colour: string, quantity: number): ShopCartLine[] => {
    const product = findProduct(id)
    return product ? [{ product, colour, quantity }] : []
}

/**
 * The shop's cart and orders, for the visit: the shop's pages share it. It starts with two products in the cart, so
 * the cart and checkout have something to show when opened on their own.
 */
@Injectable()
export class ShopCart {
    readonly lines = signal<ShopCartLine[]>([...sample('backpack', 'Tan', 1), ...sample('mug', 'Sage', 2)])
    readonly orders = signal<ShopOrder[]>(SHOP_PAST_ORDERS)
    /** The order placed on this visit, if any. */
    readonly placed = signal<ShopOrder | undefined>(undefined)

    /** How many products are in the cart. */
    readonly count = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0))
    readonly subtotal = computed(() => this.lines().reduce((sum, line) => sum + line.product.price * line.quantity, 0))

    add(product: ShopProduct, colour = product.colours[0]?.name ?? '', quantity = 1) {
        this.lines.update((lines) => {
            const index = lines.findIndex((line) => line.product.id === product.id && line.colour === colour)
            if (index < 0) {
                return [...lines, { product, colour, quantity }]
            }
            return lines.map((line, at) => (at === index ? { ...line, quantity: line.quantity + quantity } : line))
        })
    }

    /** Sets a line's quantity; none removes it. */
    setQuantity(line: ShopCartLine, quantity: number) {
        this.lines.update((lines) =>
            quantity > 0
                ? lines.map((item) => (item === line ? { ...item, quantity } : item))
                : lines.filter((item) => item !== line)
        )
    }

    /** Places an order of the cart, which empties it. */
    place(delivery: number): ShopOrder {
        const order: ShopOrder = {
            number: String(10483 + this.orders().length - SHOP_PAST_ORDERS.length),
            date: new Date(),
            status: 'Processing',
            lines: this.lines(),
            delivery
        }
        this.orders.update((orders) => [order, ...orders])
        this.placed.set(order)
        this.lines.set([])
        return order
    }

    /** Puts an order's products in the cart again. */
    reorder(order: ShopOrder) {
        order.lines.forEach((line) => this.add(line.product, line.colour, line.quantity))
    }

    readonly total = orderTotal
}
