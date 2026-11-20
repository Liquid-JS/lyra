import { TestBed } from '@angular/core/testing'

import { NbSpinnerService } from './spinner.service'

describe('NbSpinnerService', () => {
    let spinner: HTMLElement
    let service: NbSpinnerService

    beforeEach(() => {
        spinner = document.createElement('div')
        spinner.id = 'nb-global-spinner'
        spinner.style.display = 'none'
        document.body.appendChild(spinner)
        service = TestBed.inject(NbSpinnerService)
    })

    afterEach(() => spinner.remove())

    it('should show the spinner until the loaders finish, then hide it', async () => {
        let finish = (_value: string) => {}
        service.registerLoader(new Promise<string>((resolve) => (finish = resolve)))
        const loading = service.load()
        expect(spinner.style.display).toBe('block')

        finish('ready')
        await expect(loading).resolves.toEqual(['ready'])
        expect(spinner.style.display).toBe('none')
    })

    it('should hide the spinner when a loader fails, and give the failure', async () => {
        service.registerLoader(Promise.reject(new Error('No config')))

        await expect(service.load()).rejects.toThrow('No config')
        expect(spinner.style.display).toBe('none')
    })
})
