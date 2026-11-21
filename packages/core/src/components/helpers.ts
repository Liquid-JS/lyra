export type NbNullableInput = string | null | undefined
export type NbBooleanInput = boolean | NbNullableInput

/**
 * Classes as a `[class]` binding takes them: a space-separated string, an array, or an object of class names to flags.
 */
export type NbClassInput = string | string[] | Record<string, unknown> | null | undefined

export function convertToBoolProperty(val: NbBooleanInput): boolean {
    if (typeof val === 'string') {
        val = val.toLowerCase().trim()

        return val === 'true' || val === ''
    }

    return !!val
}

/** As `convertToBoolProperty`, but an input that isn't set stays `undefined`, so it can fall back to a default. */
export function convertToOptionalBoolProperty(val: NbBooleanInput): boolean | undefined {
    return val === undefined ? undefined : convertToBoolProperty(val)
}

/**
 * Whether a value written to a control is the one it holds: the same value, or arrays or plain objects, such as a
 * range, with the same items. Writing it again then changes nothing.
 */
export function sameControlValue(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) {
        return true
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((item, index) => Object.is(item, b[index]))
    }
    if (isPlainObject(a) && isPlainObject(b)) {
        const keys = Object.keys(a)
        return keys.length === Object.keys(b).length && keys.every((key) => Object.is(a[key], b[key]))
    }
    return false
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype
}
