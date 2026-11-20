import { Component, Service, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'

import { DOWN_ARROW, ENTER, LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes'
import { NbSelectModule, NbThemeModule, NbViewportRulerAdapter } from '@liquid-js/lyr-core'

// The list opens in an overlay, whose scroll blocking measures the viewport.
@Service({ autoProvided: false })
class NbViewportRulerMockAdapter extends NbViewportRulerAdapter {
    override getViewportSize(): Readonly<{ width: number, height: number }> {
        return { width: 1600, height: 900 }
    }
    override getViewportScrollPosition(): { left: number, top: number } {
        return { left: 0, top: 0 }
    }
}

// Cloud, depth 1 › Object storage, 2 › Archive, 3 › Deep, 4 › Deep Archive, 5.
@Component({
    template: `
    <nb-select
      [formControl]="control"
      [nestedLevels]="levels()"
      [multiple]="multiple()"
      [searchable]="searchable()"
      placeholder="Import from"
    >
      <nb-option value="local">This device</nb-option>
      <nb-option-nested title="Cloud">
        <nb-option value="drive">Google Drive</nb-option>
        <nb-option-nested title="Object storage">
          <nb-option value="s3">AWS S3</nb-option>
          <nb-option-nested title="Archive">
            <nb-option value="glacier">Glacier</nb-option>
            <nb-option-nested title="Deep">
              <nb-option value="deep">Deep Archive</nb-option>
            </nb-option-nested>
          </nb-option-nested>
        </nb-option-nested>
      </nb-option-nested>
      <nb-option-nested title="Locked" [disabled]="true">
        <nb-option value="vault">Vault</nb-option>
      </nb-option-nested>
      <nb-option value="browse">Browse</nb-option>
    </nb-select>
  `,
    imports: [NbSelectModule, ReactiveFormsModule]
})
class NestedSelectHostComponent {
    readonly control = new FormControl<string | string[] | null>(null)
    readonly levels = signal(3)
    readonly multiple = signal(false)
    readonly searchable = signal(false)
}

describe('NbOptionNestedComponent', () => {
    let fixture: ComponentFixture<NestedSelectHostComponent>
    let host: NestedSelectHostComponent

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const button = () => fixture.nativeElement.querySelector('nb-select button') as HTMLButtonElement
    const list = () => document.querySelector('nb-option-list .option-list') as HTMLElement
    const open = async () => {
        button().click()
        await render()
    }
    const nested = (title: string) =>
        [...document.querySelectorAll('nb-option-list nb-option-nested')].find(
            (element) => element.querySelector('.option-nested-title')?.textContent?.trim() === title
        ) as HTMLElement
    const row = (title: string) => nested(title).querySelector('.option-nested-row') as HTMLElement
    const option = (text: string) =>
        [...document.querySelectorAll('nb-option-list nb-option')].find(
            (element) => element.textContent?.trim() === text
        ) as HTMLElement
    const shown = (element: HTMLElement) => element.checkVisibility()
    // The rows in view, from the top: options by their text and nested options by their title.
    const view = () =>
        [...list().querySelectorAll<HTMLElement>('nb-option, .option-nested-row')]
            .filter(shown)
            .map((element) => element.textContent?.trim())
    const back = () => document.querySelector('nb-option-list .option-nested-back') as HTMLButtonElement | null
    // The key manager reads keyCode, which synthetic keyboard events leave at 0.
    const keyCodes: Record<string, number> = {
        ArrowDown: DOWN_ARROW,
        ArrowLeft: LEFT_ARROW,
        ArrowRight: RIGHT_ARROW,
        Enter: ENTER
    }
    const press = async (key: string) => {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
        Object.defineProperty(event, 'keyCode', { value: keyCodes[key] });
        (document.activeElement ?? document.body).dispatchEvent(event)
        await render()
    }
    const focused = () => {
        const element = document.activeElement as HTMLElement
        return element.tagName === 'NB-OPTION-NESTED'
            ? element.querySelector('.option-nested-title')?.textContent?.trim()
            : element.textContent?.trim()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [{ provide: NbViewportRulerAdapter, useClass: NbViewportRulerMockAdapter }]
        })
        fixture = TestBed.createComponent(NestedSelectHostComponent)
        host = fixture.componentInstance
        await render()
    })

    it('should show a tree with the nested options collapsed', async () => {
        await open()

        expect(list().getAttribute('role')).toBe('tree')
        expect(option('This device').getAttribute('role')).toBe('treeitem')
        expect(nested('Cloud').getAttribute('role')).toBe('treeitem')
        expect(nested('Cloud').getAttribute('aria-expanded')).toBe('false')
        expect(nested('Cloud').getAttribute('aria-level')).toBe('1')
        expect(view()).toEqual(['This device', 'Cloud', 'Locked', 'Browse'])
    })

    // The title takes its own direction, without changing how it's aligned in the row.
    it('should isolate the direction of the titles', async () => {
        await open()

        const title = nested('Cloud').querySelector('.option-nested-title')
        expect(title?.hasAttribute('dir')).toBe(false)
        expect(title?.querySelector('[dir="auto"]')?.textContent).toBe('Cloud')
    })

    it('should open and close a nested option from its row, indenting its options', async () => {
        await open()
        row('Cloud').click()
        await render()

        expect(nested('Cloud').getAttribute('aria-expanded')).toBe('true')
        expect(view()).toEqual(['This device', 'Cloud', 'Google Drive', 'Object storage', 'Locked', 'Browse'])
        expect(option('Google Drive').getAttribute('aria-level')).toBe('2')
        expect(option('Google Drive').style.getPropertyValue('--nb-option-level')).toBe('2')
        expect(document.querySelector('nb-option-list')).toBeTruthy()

        row('Cloud').click()
        await render()
        expect(view()).toEqual(['This device', 'Cloud', 'Locked', 'Browse'])
    })

    it('should select an option in a nested option, and show it on the collapsed row', async () => {
        await open()
        row('Cloud').click()
        await render()
        option('Google Drive').click()
        await render()

        expect(host.control.value).toBe('drive')
        expect(button().textContent).toContain('Google Drive')

        await open()
        expect(nested('Cloud').classList).toContain('has-selected')
        expect(nested('Object storage').classList).not.toContain('has-selected')
    })

    it('should drill in when opening a level deeper than shown, and go back', async () => {
        await open()
        row('Cloud').click()
        await render()
        row('Object storage').click()
        await render()
        expect(view()).toEqual([
            'This device',
            'Cloud',
            'Google Drive',
            'Object storage',
            'AWS S3',
            'Archive',
            'Locked',
            'Browse'
        ])

        // Its options would be at a fourth level.
        row('Archive').click()
        await render()

        expect(back()?.textContent?.trim()).toBe('Cloud')
        expect(back()?.getAttribute('aria-label')).toBe('Back to Cloud')
        expect(back()?.querySelector('[dir="auto"]')?.textContent).toBe('Cloud')
        expect(view()).toEqual(['Google Drive', 'Object storage', 'AWS S3', 'Archive', 'Glacier', 'Deep'])
        expect(option('Google Drive').getAttribute('aria-level')).toBe('1')
        expect(option('Glacier').getAttribute('aria-level')).toBe('3')
        // The list is in Cloud: it's no longer an item of the tree.
        expect(nested('Cloud').getAttribute('role')).toBe('none')

        back()?.click()
        await render()

        expect(back()).toBeNull()
        // Archive's options would be at a fourth level again, so it closes.
        expect(view()).toEqual([
            'This device',
            'Cloud',
            'Google Drive',
            'Object storage',
            'AWS S3',
            'Archive',
            'Locked',
            'Browse'
        ])
        expect(nested('Cloud').getAttribute('role')).toBe('treeitem')
        expect(focused()).toBe('Cloud')
    })

    it('should show the selected option as the list opens, however deep it is', async () => {
        host.control.setValue('deep')
        await render()
        await open()

        expect(back()?.textContent?.trim()).toBe('Object storage')
        expect(view()).toEqual(['AWS S3', 'Archive', 'Glacier', 'Deep', 'Deep Archive'])
        expect(focused()).toBe('Deep Archive')
    })

    it('should move through the tree with the arrow keys', async () => {
        await open()
        await press('ArrowDown')
        expect(focused()).toBe('Cloud')

        await press('ArrowRight')
        expect(nested('Cloud').getAttribute('aria-expanded')).toBe('true')
        expect(focused()).toBe('Cloud')

        await press('ArrowRight')
        expect(focused()).toBe('Google Drive')

        await press('ArrowLeft')
        expect(focused()).toBe('Cloud')

        await press('ArrowLeft')
        expect(nested('Cloud').getAttribute('aria-expanded')).toBe('false')

        await press('Enter')
        expect(nested('Cloud').getAttribute('aria-expanded')).toBe('true')

        // Collapsed and disabled options are skipped.
        await press('ArrowLeft')
        await press('ArrowDown')
        expect(focused()).toBe('Browse')
    })

    it('should go back with ArrowLeft from the top of where the list is drilled into', async () => {
        host.control.setValue('deep')
        await render()
        await open()
        await press('ArrowLeft')
        expect(focused()).toBe('Deep')
        await press('ArrowLeft')
        expect(focused()).toBe('Deep')
        await press('ArrowLeft')
        expect(focused()).toBe('Archive')
        await press('ArrowLeft')
        await press('ArrowLeft')

        expect(back()?.textContent?.trim()).toBe('Cloud')
        expect(focused()).toBe('Object storage')
    })

    it('should show a level at a time with one level shown', async () => {
        host.levels.set(1)
        await render()
        await open()
        row('Cloud').click()
        await render()

        expect(back()?.textContent?.trim()).toBe('Cloud')
        expect(view()).toEqual(['Google Drive', 'Object storage'])
        expect(focused()).toBe('Google Drive')
    })

    it('should show matching options with the nested options they are in while searching', async () => {
        host.searchable.set(true)
        host.control.setValue('deep')
        await render()
        await open()
        const input = document.querySelector('nb-option-list .select-search input') as HTMLInputElement

        input.value = 'glac'
        input.dispatchEvent(new Event('input'))
        await render()

        expect(back()).toBeNull()
        expect(view()).toEqual(['Cloud', 'Object storage', 'Archive', 'Glacier'])
        expect(option('Glacier').getAttribute('aria-level')).toBe('4')

        input.value = ''
        input.dispatchEvent(new Event('input'))
        await render()
        expect(back()?.textContent?.trim()).toBe('Object storage')
    })

    it('should disable a nested option with its options', async () => {
        await open()
        row('Locked').click()
        await render()

        expect(nested('Locked').getAttribute('aria-disabled')).toBe('true')
        expect(nested('Locked').getAttribute('aria-expanded')).toBe('false')
        expect(option('Vault').getAttribute('aria-disabled')).toBe('true')
    })

    it('should keep a multiple select open and select only options', async () => {
        host.multiple.set(true)
        await render()
        await open()
        row('Cloud').click()
        await render()
        option('Google Drive').click()
        await render()
        row('Object storage').click()
        await render()
        option('AWS S3').click()
        await render()

        expect(host.control.value).toEqual(['drive', 's3'])
        expect(list()).toBeTruthy()
        expect(list().getAttribute('aria-multiselectable')).toBe('true')
    })
})
