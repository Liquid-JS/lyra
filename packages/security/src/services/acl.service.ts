import { inject, Service } from '@angular/core'
import { NB_SECURITY_OPTIONS_TOKEN, NbAclOptions, NbAclRole, NbAccessControl } from '../security.options'

const shallowObjectClone = <T extends object>(o: T): T => ({ ...o })
const shallowArrayClone = <T>(a: T[]): T[] => Object.assign(new Array<T>(), a)
const popParent = (abilities: NbAclRole) => {
    const parent = abilities.parent
    delete abilities.parent
    return parent
}

/**
 * The access control list: which roles have which permissions on which resources, from `provideNbSecurity`'s
 * `accessControl` or `setAccessControl`. A role has its `parent`'s permissions too, and `*` as a resource grants a
 * permission on every resource.
 */
@Service({ autoProvided: false })
export class NbAclService {
    private static readonly ANY_RESOURCE = '*'
    protected readonly settings = inject<NbAclOptions>(NB_SECURITY_OPTIONS_TOKEN, { optional: true }) ?? {}

    private state: NbAccessControl = {}

    constructor() {
        const settings = this.settings

        if (settings.accessControl) {
            this.setAccessControl(settings.accessControl)
        }
    }

    /** Registers the roles of the list with their parents and abilities, replacing those of the same names. */
    setAccessControl(list: NbAccessControl) {
        for (const [role, value] of Object.entries(list)) {
            const abilities = shallowObjectClone(value)
            const parent = popParent(abilities)
            this.register(role, parent, abilities)
        }
    }

    /** Registers a role, replacing one of the same name, with its parent and the resources of each permission. */
    register(role: string, parent?: string, abilities: { [permission: string]: string | string[] | undefined } = {}) {
        this.validateRole(role)

        this.state[role] = {
            parent
        }

        for (const [permission, value] of Object.entries(abilities)) {
            const resources = typeof value === 'string' ? [value] : value ?? []
            this.allow(role, permission, shallowArrayClone(resources))
        }
    }

    /** Grants a role a permission on resources, registering the role when it's new. */
    allow(role: string, permission: string, resource: string | string[]) {
        this.validateRole(role)

        if (!this.getRole(role)) {
            this.register(role, undefined, {})
        }

        resource = typeof resource === 'string' ? [resource] : resource

        let resources = shallowArrayClone(this.getRoleResources(role, permission))
        resources = resources.concat(resource)

        this.state[role][permission] = resources.filter((item, pos) => resources.indexOf(item) === pos)
    }

    /** Whether the role, or one of its ancestors, has the permission on the resource; `*` and `''` throw. */
    can(role: string, permission: string, resource: string): boolean {
        this.validateResource(resource)

        const parentRole = this.getRoleParent(role)
        const parentCan = !!parentRole && this.can(parentRole, permission, resource)
        return parentCan || this.exactCan(role, permission, resource)
    }

    private getRole(role: string): NbAclRole {
        return this.state[role]
    }

    private validateRole(role: string) {
        if (!role) {
            throw new Error('NbAclService: role name cannot be empty')
        }
    }

    private validateResource(resource: string) {
        if (!resource || [NbAclService.ANY_RESOURCE].includes(resource)) {
            throw new Error('NbAclService: cannot use empty or bulk \'*\' resource placeholder with \'can\' method')
        }
    }

    private exactCan(role: string, permission: string, resource: string) {
        const resources = this.getRoleResources(role, permission)
        return resources.includes(resource) || resources.includes(NbAclService.ANY_RESOURCE)
    }

    private getRoleResources(role: string, permission: string): string[] {
        const resources = this.getRoleAbilities(role)[permission]
        return Array.isArray(resources) ? resources : []
    }

    private getRoleAbilities(role: string): NbAclRole {
        const abilities = shallowObjectClone(this.state[role] || {})
        popParent(abilities)
        return abilities
    }

    private getRoleParent(role: string): string | undefined {
        return this.state[role]?.parent
    }
}
