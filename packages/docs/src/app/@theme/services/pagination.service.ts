import { inject, Service } from '@angular/core';
import { NgdStructureService } from './structure.service';
import { NgdTextService } from './text.service';
import { NgdMenuService } from './menu.service';
import { NgdPreparedEntry } from '../../docs.model';

/**
 * Pagination Item options
 */
interface NgdPaginationItem {
  title: string;
  slag?: string;
  link: string;
  prev?: {
    title: string;
    link: string;
  };
  next?: {
    title: string;
    link: string;
  };
  parent?: Pick<NgdPaginationItem, 'link'>;
}

@Service()
export class NgdPaginationService {
  private readonly structureService = inject(NgdStructureService);
  private readonly textService = inject(NgdTextService);
  private readonly menuService = inject(NgdMenuService);

  protected paginationItems = new Array<NgdPaginationItem>();

  /** The previous and next pages of the area at `/<area>`. */
  setPaginationItems(area: string) {
    this.paginationItems = this.addPrevNextPointers(
      this.prepareItems(this.structureService.getPreparedStructure(area), { link: `/${area}` }),
    );
  }

  protected prepareItems(structure: NgdPreparedEntry[], parent?: Pick<NgdPaginationItem, 'link'>): NgdPaginationItem[] {
    return structure
      .filter((item) => item.type !== 'block')
      .reduce((result, item) => {
        const title = item.name;
        const paginationItem: NgdPaginationItem = {
          title,
          parent: parent,
          slag: item.type === 'page' || item.type === 'tabs' ? item.slag : undefined,
          link: this.menuService.createItemLink({ title, parent }),
        };

        if (item.type === 'page' || item.type === 'tabs') {
          result.push(paginationItem);
        }

        if ('children' in item) {
          return result.concat(this.prepareItems(item.children, paginationItem));
        }

        return result;
      }, new Array<NgdPaginationItem>());
  }

  protected addPrevNextPointers(items: NgdPaginationItem[]): NgdPaginationItem[] {
    return items
      .map((paginationItem, index, paginationItems) => {
        const prev = paginationItems[index - 1];
        const next = paginationItems[index + 1];

        if (prev) {
          paginationItem.prev = {
            link: prev.link,
            title: prev.title,
          };
        }

        if (next) {
          paginationItem.next = {
            link: next.link,
            title: next.title,
          };
        }

        return paginationItem;
      });
  }

  getPaginationItem(slag?: string): NgdPaginationItem | undefined {
    return this.paginationItems.find((item) => item.slag === slag);
  }
}
