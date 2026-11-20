export interface Schema {
    project: string
    theme: 'default' | 'dark' | 'cosmic' | 'corporate' | 'material-light' | 'material-dark'
    customization: boolean
    layout: boolean
    /** @deprecated Lyra animates without an animations provider, so this option has no effect. */
    animations: boolean
}
