import { Service } from '@angular/core'

import { NbComponentOrCustomStatus, NbComponentStatus } from '../components/component-status'

@Service()
export class NbStatusService {
    readonly coreStatuses: NbComponentStatus[] = ['basic', 'primary', 'info', 'warning', 'danger', 'control']

    isCoreStatus(status: NbComponentOrCustomStatus): boolean {
        return this.coreStatuses.includes(status as NbComponentStatus)
    }

    isCustomStatus(status: NbComponentOrCustomStatus): boolean {
        if (this.isValidStatusString(status)) {
            return !this.isCoreStatus(status)
        }

        return false
    }

    getStatusClass(status?: NbComponentOrCustomStatus): string | undefined {
        if (this.isValidStatusString(status)) {
            return `status-${status}`
        }

        return undefined
    }

    protected isValidStatusString(status?: NbComponentOrCustomStatus): boolean {
        return typeof status === 'string' && status.length > 0
    }
}
