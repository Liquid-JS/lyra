import { InjectionToken } from '@angular/core'
import { NgdAreaEntry, NgdDocs } from './docs.model'

export const STRUCTURE = new InjectionToken<NgdAreaEntry[]>('Docs Structure')
export const DOCS = new InjectionToken<NgdDocs>('Docs Structure')
/** The path of the docs area a page is in, e.g. `components`, which its route provides. */
export const NGD_AREA = new InjectionToken<string>('Docs area')
