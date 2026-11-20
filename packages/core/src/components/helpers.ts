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
