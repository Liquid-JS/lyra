import { describe, expect, it } from 'vitest'

import { colourIn, cssOf, derive, display, numberOf, partsOf, pixels, shadowsOf, sketchColour, valuesOf, weightOf } from './values.ts'

describe('the theme values', () => {
    it('works out variables as the browser does, with fallbacks', () => {
        const value = valuesOf({ 'border-radius': '0.25rem', 'button-radius': 'calc(var(--border-radius) * 3)', 'a': 'var(--missing, var(--border-radius))', 'loop': 'var(--loop)' })
        expect(value('button-radius')).toBe('calc(0.25rem * 3)')
        expect(value('a')).toBe('0.25rem')
        expect(value('loop')).toBe('')
        expect(value('none')).toBeUndefined()
    })

    it('measures lengths in pixels, but not em or percentages', () => {
        expect(numberOf('calc(0.25rem * 3)')).toBe(12)
        expect(numberOf('calc(1rem - 2px)')).toBe(14)
        expect(numberOf('-4px')).toBe(-4)
        expect(numberOf('1.5em')).toBeUndefined()
        expect(numberOf('50%')).toBeUndefined()
        expect(numberOf('auto')).toBeUndefined()
        expect(partsOf('calc(1rem + 2px) 0.5rem')).toEqual(['calc(1rem + 2px)', '0.5rem'])
        expect(pixels('calc(1rem + 2px) 0.5rem')).toBe('18px 8px')
        expect(pixels('bold')).toBe('')
    })

    it('shows formulas by name on the Theme board and reads them back as CSS', () => {
        const formulas = { 'border-radius': '0.25rem', 'control-inset': '0.5rem', 'border-width': '1px' }
        expect(display('calc(var(--border-radius) * 3)')).toBe('border-radius * 3')
        expect(display('calc(var(--control-inset) + (var(--border-width) * -1))')).toBe('control-inset - border-width')
        expect(cssOf('border-radius * 3', formulas)).toBe('calc(var(--border-radius) * 3)')
        expect(cssOf('12px', formulas)).toBe('12px')
    })

    it('gives colours as Sketch takes them', () => {
        expect(sketchColour('#abc')).toBe('#aabbccff')
        expect(sketchColour('#3469D1')).toBe('#3469d1ff')
        expect(sketchColour('rgba(14, 12, 11, 0.72)')).toBe('#0e0c0bb8')
        expect(sketchColour('transparent')).toBe('#00000000')
        expect(colourIn('0 0.5rem 1rem 0 rgba(44, 51, 73, 0.1)')).toBe('#2c33491a')
    })

    it('splits shadows into outer and inner ones', () => {
        const { outer, inner } = shadowsOf('0 0.5rem 1rem 0 rgba(0, 0, 0, 0.5), inset 0 0 0 1px #fff')
        expect(outer).toEqual([{ color: '#00000080', x: 0, y: 8, blur: 16, spread: 0, enabled: true }])
        expect(inner).toEqual([{ color: '#ffffffff', x: 0, y: 0, blur: 0, spread: 1, enabled: true }])
        expect(shadowsOf('none')).toEqual({ outer: [], inner: [] })
    })

    it('derives the shades a theme leaves out, keeping those it sets', () => {
        const base = Object.fromEntries([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map((shade, index) => [`color-basic-${shade}`, `#${(255 - index * 20).toString(16).repeat(3)}`]))
        const values = derive({ 'color-primary-500': '#ff7a1a', 'color-primary-100': '#ffffff', 'color-basic-600': '#968b7e' }, base)
        expect(values['color-primary-100']).toBe('#ffffff')
        expect(values['color-primary-900']).toMatch(/^#[0-9a-f]{6}$/)
        expect(values['color-primary-transparent-100']).toBeDefined()
        expect(values['color-basic-1100']).toMatch(/^#[0-9a-f]{6}$/)
        expect(values['color-success-500']).toBeUndefined()
    })

    it('maps CSS weights to Sketch\'s index', () => {
        expect(weightOf(400)).toBe(5)
        expect(weightOf(650)).toBe(9)
        expect(weightOf(1000)).toBe(12)
    })
})
