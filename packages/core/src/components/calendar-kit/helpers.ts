export const batch = <T>(target: T[], batchSize: number, offset: number = 0): T[][] => target.reduce((res, item, index) => {
    const chunkIndex = Math.floor((index + offset) / batchSize)
    if (!res[chunkIndex]) {
        res[chunkIndex] = []
    }
    res[chunkIndex].push(item)
    return res
}, new Array<T[]>())
/**
 * The numbers from `from` up to, not including, `to`, or what `producer` makes of each.
 */
export function rangeFromTo(from: number, to?: number): number[]
export function rangeFromTo<T>(from: number, to: number, producer: (i: number) => T): T[]
export function rangeFromTo<T>(from: number, to = 0, producer?: (i: number) => T): Array<T | number> {
    const arr = new Array<T | number>()

    for (let i = from; i < to; i++) {
        arr.push(producer ? producer(i) : i)
    }

    return arr
}

/**
 * The numbers from 0 up to, not including, `bound`, or what `producer` makes of each.
 */
export function range(bound: number): number[]
export function range<T>(bound: number, producer: (i: number) => T): T[]
export function range<T>(bound: number, producer?: (i: number) => T): Array<T | number> {
    return producer ? rangeFromTo(0, bound, producer) : rangeFromTo(0, bound)
}
