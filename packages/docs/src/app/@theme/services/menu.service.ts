import { inject, Service } from '@angular/core'
import { NbMenuItem } from '@liquid-js/lyr-core'

import { NgdPreparedEntry, NgdPreparedMenuEntry } from '../../docs.model'
import { NgdStructureService } from './structure.service'
import { NgdTextService } from './text.service'

interface IItemLink {
    title: string
    parent?: {
        link?: string
    }
}

@Service()
export class NgdMenuService {
    private readonly structureService = inject(NgdStructureService)
    private readonly textService = inject(NgdTextService)

    /** The sidebar menu of the area at `/<area>`. */
    getPreparedMenu(area: string): Array<NbMenuItem<NgdPreparedMenuEntry>> {
        return this.prepareMenu(this.structureService.getPreparedStructure(area), `/${area}`)
    }

    /**
     * The menu of the structure under `path`. Only pages and tabs have a route, so only they link; a section opens and
     * closes its items, and a group heads them.
     */
    prepareMenu(
        structure: NgdPreparedEntry[],
        path: string,
        parent?: NbMenuItem<NgdPreparedMenuEntry>
    ): Array<NbMenuItem<NgdPreparedMenuEntry>> {
        return structure
            .filter((item) => item.type !== 'block')
            .map((item) => {
                const itemPath = `${path}/${this.textService.createSlag(item.name)}`
                const menuItem: NbMenuItem<NgdPreparedMenuEntry> = {
                    title: item.name,
                    pathMatch: 'prefix',
                    parent,
                    data: item,
                    group: item.type === 'group'
                }
                if (item.type === 'page' || item.type === 'tabs') {
                    menuItem.link = itemPath
                }

                if ('children' in item && item.children.some((child) => child.type === 'page' || child.type === 'tabs')) {
                    menuItem.children = this.prepareMenu(item.children, itemPath, menuItem)
                }

                return menuItem
            })
    }

    createItemLink<T extends IItemLink>(item: T): string {
        const url = this.textService.createSlag(item.title)

        return item.parent ? `${item.parent.link}/${url}` : url
    }
}
