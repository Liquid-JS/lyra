import { computed, Injectable, signal } from '@angular/core'

import { BookBooking, BOOKINGS, openDayFromToday, serviceOf } from './book-data'

/** What the customer fills in on the way to a booking. */
export interface BookDetails {
    name: string
    email: string
    phone: string
    notes: string
}

/** Whoever is free, instead of a named practitioner. */
export const ANYONE = 'anyone'

/** The booking being made, step by step, and the customer's bookings, kept while the app is open. */
@Injectable({ providedIn: 'root' })
export class BookBookingService {
    readonly serviceId = signal<string | undefined>(undefined)
    readonly practitioner = signal<string | undefined>(undefined)
    readonly date = signal<Date | undefined>(undefined)
    readonly time = signal<string | undefined>(undefined)
    readonly details = signal<BookDetails | undefined>(undefined)

    readonly service = computed(() => {
        const id = this.serviceId()
        return id ? serviceOf(id) : undefined
    })

    readonly bookings = signal<BookBooking[]>(BOOKINGS)
    /** The booking just made, which the confirmation shows. */
    readonly last = signal<BookBooking | undefined>(undefined)

    private next = 4950

    /** Starts over, keeping a service picked from the home page. */
    start(serviceId?: string) {
        this.serviceId.set(serviceId)
        this.practitioner.set(undefined)
        this.date.set(undefined)
        this.time.set(undefined)
        this.details.set(undefined)
    }

    /** Books what's been picked and returns the booking. */
    confirm(): BookBooking | undefined {
        const serviceId = this.serviceId()
        const date = this.date()
        const time = this.time()
        if (!serviceId || !date || !time) {
            return undefined
        }
        const booking: BookBooking = {
            reference: `STL-${this.next++}`,
            serviceId,
            practitioner: this.practitioner() ?? ANYONE,
            date,
            time,
            status: 'confirmed'
        }
        this.bookings.update((bookings) => [...bookings, booking])
        this.last.set(booking)
        this.start()
        return booking
    }

    cancel(reference: string) {
        this.bookings.update((bookings) =>
            bookings.map((booking) => (booking.reference === reference ? { ...booking, status: 'cancelled' } : booking))
        )
    }

    /** A booking to show when none was just made, e.g. opening the confirmation on its own. */
    sample(): BookBooking {
        return { reference: 'STL-4950', serviceId: 'massage', practitioner: 'Emma Brown', date: openDayFromToday(5), time: '15:00', status: 'confirmed' }
    }
}
