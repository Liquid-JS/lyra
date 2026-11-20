import { NbFontIconPackParams, NbIconPackParams } from './icon-pack'

export interface NbIconOptions {
    [name: string]: unknown
}

export interface NbIcon {
    getClasses(options?: NbIconOptions): string[]
    getContent(options?: NbIconOptions): string
}

export class NbFontIcon implements NbIcon {

    constructor(protected name: string, protected content: string, protected params: NbFontIconPackParams = {}) {}

    getClasses(_options?: NbIconOptions): string[] {
        const classes = new Array<string>()

        if (this.params.packClass) {
            classes.push(this.params.packClass)
        }

        const name = this.params.iconClassPrefix ? `${this.params.iconClassPrefix}-${this.name}` : this.name
        classes.push(name)
        return classes
    }

    getContent(_options?: NbIconOptions): string {
        return this.content
    }
}

export class NbSvgIcon implements NbIcon {

    constructor(protected name: string, protected content: string, protected params: NbIconPackParams = {}) {}

    getClasses(_options?: NbIconOptions): string[] {
        const classes = new Array<string>()

        if (this.params.packClass) {
            classes.push(this.params.packClass)
        }
        return classes
    }

    getContent(_options?: NbIconOptions): string {
        return this.content
    }
}
