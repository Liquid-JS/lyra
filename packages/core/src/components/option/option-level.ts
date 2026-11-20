/**
 * Sets how deep a row is in the view of a list, which indents it.
 */
export function setLevel(row: HTMLElement, level: number) {
    // Only indented rows have the spacer that indents them, so lists without nested options have none.
    row.classList.toggle('nb-option-indented', level > 1)
    if (level > 1) {
        row.style.setProperty('--nb-option-level', String(level))
    } else {
        row.style.removeProperty('--nb-option-level')
    }
}
