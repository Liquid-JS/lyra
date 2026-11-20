import { Service } from '@angular/core';

import { NbTreeGridPresentationNode } from './tree-grid.model';

export interface NbToggleOptions {
  /** Also expands or collapses every descendant. */
  deep?: boolean;
}

@Service()
export class NbTreeGridService<T> {
  expand(data: NbTreeGridPresentationNode<T>[], row: T, options: NbToggleOptions = {}) {
    const node = this.findNode(data, row);
    node.expanded = true;

    if (options.deep && node.hasChildren()) {
      node.children.forEach((n: NbTreeGridPresentationNode<T>) => this.expand(data, n.data, options));
    }
  }

  collapse(data: NbTreeGridPresentationNode<T>[], row: T, options: NbToggleOptions = {}) {
    const node = this.findNode(data, row);
    node.expanded = false;

    if (options.deep && node.hasChildren()) {
      node.children.forEach((n: NbTreeGridPresentationNode<T>) => this.collapse(data, n.data, options));
    }
  }

  toggle(data: NbTreeGridPresentationNode<T>[], row: T, options: NbToggleOptions = {}) {
    const node = this.findNode(data, row);
    if (node.expanded) {
      this.collapse(data, row, options);
    } else {
      this.expand(data, row, options);
    }
  }

  private findNode(data: NbTreeGridPresentationNode<T>[], row: T): NbTreeGridPresentationNode<T> {
    const node = this.find(data, row);
    if (!node) {
      throw new Error('NbTreeGridService: the row is not in the tree grid data.');
    }
    return node;
  }

  private find(data: NbTreeGridPresentationNode<T>[], row: T): NbTreeGridPresentationNode<T> | undefined {
    const toCheck: NbTreeGridPresentationNode<T>[] = [...data];

    for (const node of toCheck) {
      if (node.data === row) {
        return node;
      }

      if (node.hasChildren()) {
        toCheck.push(...node.children);
      }
    }

    return undefined;
  }
}
