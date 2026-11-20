export class NbColorHelper {
    static shade(color: string, weight: number) {
        return NbColorHelper.mix('#000000', color, weight)
    }

    static tint(color: string, weight: number) {
        return NbColorHelper.mix('#ffffff', color, weight)
    }

    static mix(color1: string, color2: string, weight: number) {
        const d2h = (d: number) => d.toString(16)
        const h2d = (h: string) => parseInt(h, 16)

        let result = '#'
        for (let i = 1; i < 7; i += 2) {
            const firstPart = h2d(color1.slice(i, i + 2))
            const secondPart = h2d(color2.slice(i, i + 2))
            const resultPart = d2h(Math.floor(secondPart + (firstPart - secondPart) * (weight / 100.0)))
            result += ('0' + resultPart).slice(-2)
        }
        return result
    }

    static hexToRgbA(hex: string, alpha: number | string) {
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            let digits = hex.substring(1).split('')
            if (digits.length === 3) {
                digits = [digits[0], digits[0], digits[1], digits[1], digits[2], digits[2]]
            }
            const c = Number('0x' + digits.join(''))
            return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')'
        }
        throw new Error('Bad Hex')
    }
}
