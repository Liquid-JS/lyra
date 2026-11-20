import { Service } from '@angular/core';
import { NgdDocMember } from '../../docs.model';

@Service()
export class NgdMetadataService {
  /**
   * Whether a member is part of the API the docs show. Inherited members are: a component's inputs often come from a
   * base class, e.g. the button's, which has no page of its own. The generator leaves out protected and private ones.
   */
  isPublic(prop: NgdDocMember): boolean {
    return !prop.isDocsPrivate;
  }
}
