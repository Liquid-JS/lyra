/** The classes that put an element, and everything in it, in a state it normally only takes from interaction. */
export const FORCED_STATE_CLASSES = {
    hover: 'npg-state-hover',
    focus: 'npg-state-focus',
    active: 'npg-state-active'
} as const

const STATES: Record<string, string> = {
    'hover': FORCED_STATE_CLASSES.hover,
    'focus': FORCED_STATE_CLASSES.focus,
    'focus-visible': FORCED_STATE_CLASSES.focus,
    'focus-within': FORCED_STATE_CLASSES.focus,
    'active': FORCED_STATE_CLASSES.active
}
const PSEUDO = /:(hover|focus-visible|focus-within|focus|active)(?![\w-])/g

// A rule's copy with its interaction states matched by the state classes instead, in the at-rules it's in.
function copies(rules: CSSRuleList, out: string[]) {
    for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule) {
            if (PSEUDO.test(rule.selectorText)) {
                PSEUDO.lastIndex = 0
                const selector = rule.selectorText.replace(PSEUDO, (_, state: string) => {
                    const name = STATES[state]
                    return `:is(.${name}, .${name} *)`
                })
                out.push(`${selector} { ${rule.style.cssText} }`)
            }
            PSEUDO.lastIndex = 0
        } else if (rule instanceof CSSConditionRule) {
            // @media, @supports and @container, by their own text up to the block.
            const inner: string[] = []
            copies(rule.cssRules, inner)
            if (inner.length) {
                out.push(`${rule.cssText.slice(0, rule.cssText.indexOf('{'))} { ${inner.join('\n')} }`)
            }
        } else if (rule instanceof CSSLayerBlockRule) {
            const inner: string[] = []
            copies(rule.cssRules, inner)
            if (inner.length) {
                out.push(`@layer ${rule.name} { ${inner.join('\n')} }`)
            }
        }
    }
}

/**
 * Lets elements show hover, focus and pressed without being interacted with: each of the page's rules for those
 * states is copied, matching an element in one of `FORCED_STATE_CLASSES` instead, so they show the real styles side
 * by side. Returns a function that removes the copies; call it again after more styles load to copy theirs too.
 */
export function forceStates(document: Document): () => void {
    const out: string[] = []
    for (const sheet of Array.from(document.styleSheets)) {
        if (sheet.ownerNode instanceof Element && sheet.ownerNode.hasAttribute('data-forced-states')) {
            continue
        }
        let rules: CSSRuleList
        try {
            rules = sheet.cssRules
        } catch {
            // Another origin's sheet, e.g. a font's, which has no states to copy.
            continue
        }
        copies(rules, out)
    }
    const style = document.createElement('style')
    style.setAttribute('data-forced-states', '')
    style.textContent = out.join('\n')
    document.head.append(style)
    return () => style.remove()
}
