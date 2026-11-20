export * from '@angular/cdk/keycodes'

/**
 * Whether a keydown belongs to an IME composition, e.g. of a Japanese word, rather than to the key it names. Safari
 * fires the keydown of the Enter that ends a composition after `compositionend`, so `isComposing` is false then and
 * only key code 229 tells.
 */
export function isComposing(event: KeyboardEvent): boolean {
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- Safari marks the keydown that ends a composition only by key code 229.
    return event.isComposing || event.keyCode === 229
}
