import { Component, signal } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms'

import {
    NbComponentSize,
    NbFileDropModule,
    NbFileRejection,
    NbThemeModule,
    NbValidationModule,
    provideNbTexts
} from '@liquid-js/lyr-core'

@Component({
    template: `
    <label for="upload">Attachment</label>
    <nb-file-drop
      id="upload"
      [formControl]="control"
      [accept]="accept()"
      [multiple]="multiple()"
      [maxSize]="maxSize()"
      [maxFiles]="maxFiles()"
      [size]="size()"
      nbValidation
      (rejected)="rejections.push($event)"
    >
      @if (customPreview()) {
        <ng-template nbFileDropPreview let-files let-remove="remove" let-url="url">
          @for (file of files; track file) {
            <button type="button" aria-label="Remove" (click)="remove(file)"><img class="preview" [src]="url(file)" alt="" /></button>
          }
        </ng-template>
      }
    </nb-file-drop>
  `,
    imports: [ReactiveFormsModule, NbFileDropModule, NbValidationModule]
})
class FileDropHostComponent {
    readonly control = new FormControl<unknown>(null, Validators.required)
    readonly accept = signal('')
    readonly multiple = signal(false)
    readonly maxSize = signal<number | undefined>(undefined)
    readonly maxFiles = signal<number | undefined>(undefined)
    readonly customPreview = signal(false)
    readonly size = signal<NbComponentSize>('medium')
    readonly rejections = new Array<NbFileRejection[]>()
}

const file = (name: string, type: string, size = 10) => new File(['x'.repeat(size)], name, { type })

describe('NbFileDropComponent', () => {
    let fixture: ComponentFixture<FileDropHostComponent>
    let host: FileDropHostComponent

    const render = async () => {
        fixture.detectChanges()
        await fixture.whenStable()
    }
    const drop = () => fixture.nativeElement.querySelector('nb-file-drop') as HTMLElement
    const input = () => drop().querySelector('input[type="file"]') as HTMLInputElement
    const transfer = (...files: File[]) => {
        const data = new DataTransfer()
        files.forEach((f) => data.items.add(f))
        return data
    }
    const dropFiles = async (...files: File[]) => {
        drop().dispatchEvent(new DragEvent('drop', { dataTransfer: transfer(...files), bubbles: true, cancelable: true }))
        await render()
    }

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [NbThemeModule.forRoot()] })
        fixture = TestBed.createComponent(FileDropHostComponent)
        host = fixture.componentInstance
        await render()
    })

    it('should label its native input and describe it with the prompt', () => {
        expect(input().id).toBe('upload')
        expect(drop().hasAttribute('id')).toBe(false)
        expect(input().labels?.[0]?.textContent).toBe('Attachment')
        const description = document.getElementById(input().getAttribute('aria-describedby')?.split(' ')[0] ?? '')
        expect(description?.textContent?.trim()).toBe('Drop a file here or click to choose one')
    })

    it('should set a dropped file as the value', async () => {
        const image = file('photo.png', 'image/png')
        await dropFiles(image)

        expect(host.control.value).toBe(image)
        expect(host.control.touched).toBe(true)
        expect(drop().querySelector('.file-name')?.textContent).toBe('photo.png')
    })

    it('should replace the file of a single-file drop and reject extra dropped files', async () => {
        const first = file('a.png', 'image/png')
        const second = file('b.png', 'image/png')
        const third = file('c.png', 'image/png')
        await dropFiles(first)
        await dropFiles(second, third)

        expect(host.control.value).toBe(second)
        expect(host.rejections).toEqual([[{ file: third, reason: 'count' }]])
    })

    it('should accept files matching any accept entry', async () => {
        host.accept.set('image/*, .PDF')
        host.multiple.set(true)
        await render()
        const image = file('photo.jpg', 'image/jpeg')
        const pdf = file('report.pdf', 'application/pdf')
        const text = file('notes.txt', 'text/plain')
        await dropFiles(image, pdf, text)

        expect(host.control.value).toEqual([image, pdf])
        expect(host.rejections).toEqual([[{ file: text, reason: 'type' }]])
    })

    it('should reject files over maxSize and over maxFiles', async () => {
        host.multiple.set(true)
        host.maxSize.set(100)
        host.maxFiles.set(2)
        await render()
        const big = file('big.bin', '', 200)
        const files = [file('1.bin', ''), file('2.bin', ''), file('3.bin', '')]
        await dropFiles(big, ...files)

        expect(host.control.value).toEqual(files.slice(0, 2))
        expect(host.rejections).toEqual([
            [
                { file: big, reason: 'size' },
                { file: files[2], reason: 'count' }
            ]
        ])
    })

    it('should add files to a multiple drop and remove them', async () => {
        host.multiple.set(true)
        await render()
        const first = file('a.txt', 'text/plain')
        const second = file('b.txt', 'text/plain')
        await dropFiles(first)
        await dropFiles(second)

        expect(host.control.value).toEqual([first, second]);

        (drop().querySelector('.file-remove') as HTMLButtonElement).click()
        await render()

        expect(host.control.value).toEqual([second])
    })

    // The theme scales the rest from the size class; the specs run without the global theme styles.
    it('should take its size', async () => {
        expect(drop().classList).toContain('size-medium')

        host.size.set('giant')
        await render()

        expect(drop().classList).toContain('size-giant')
    })

    it('should label the remove buttons with the file name', async () => {
        await dropFiles(file('a.txt', 'text/plain'))

        expect(drop().querySelector('.file-remove')?.getAttribute('aria-label')).toBe('Remove a.txt')
    })

    // A name aligns by its own direction, so a long one in another script is cut at its end.
    it('should give the file names their own direction', async () => {
        await dropFiles(file('a.txt', 'text/plain'))

        const name = drop().querySelector('.file-name')
        expect(name?.getAttribute('dir')).toBe('auto')
        expect(name?.textContent?.trim()).toBe('a.txt')
    })

    it('should add files chosen in the file dialog', async () => {
        const chosen = file('a.txt', 'text/plain')
        input().files = transfer(chosen).files
        input().dispatchEvent(new Event('change'))
        await render()

        expect(host.control.value).toBe(chosen)
        expect(input().value).toBe('')
    })

    it('should add pasted files', async () => {
        const pasted = file('screenshot.png', 'image/png')
        drop().dispatchEvent(new ClipboardEvent('paste', { clipboardData: transfer(pasted), bubbles: true }))
        await render()

        expect(host.control.value).toBe(pasted)
    })

    it('should open the file dialog on click, but not from its buttons', async () => {
        await dropFiles(file('a.txt', 'text/plain'))
        const click = vi.spyOn(input(), 'click').mockImplementation(() => undefined)

        drop().click()
        expect(click).toHaveBeenCalledTimes(1);

        (drop().querySelector('.file-remove') as HTMLButtonElement).click()
        expect(click).toHaveBeenCalledTimes(1)
    })

    it('should show the drag state until the drag leaves', async () => {
        const data = transfer(file('a.txt', 'text/plain'))
        const child = drop().querySelector('.prompt') as HTMLElement
        drop().dispatchEvent(new DragEvent('dragenter', { dataTransfer: data, bubbles: true }))
        child.dispatchEvent(new DragEvent('dragenter', { dataTransfer: data, bubbles: true }))
        // Moving from the drop zone onto its child leaves the drop zone, but the drag is still over it.
        drop().dispatchEvent(new DragEvent('dragleave', { dataTransfer: data }))
        await render()

        expect(drop().classList).toContain('drag-over')

        child.dispatchEvent(new DragEvent('dragleave', { dataTransfer: data, bubbles: true }))
        await render()

        expect(drop().classList).not.toContain('drag-over')
    })

    it('should stay focused while focus moves within it, and be touched when it leaves', async () => {
        await dropFiles(file('a.txt', 'text/plain'))
        host.control.markAsUntouched()
        const remove = drop().querySelector('.file-remove') as HTMLButtonElement

        input().focus()
        remove.focus()
        await render()

        expect(drop().classList).toContain('focused')
        expect(host.control.touched).toBe(false)

        remove.blur()
        await render()

        expect(drop().classList).not.toContain('focused')
        expect(host.control.touched).toBe(true)
    })

    it('should focus its input as a click opens the dialog, and be touched when the dialog is cancelled', async () => {
        const click = vi.spyOn(input(), 'click').mockImplementation(() => undefined)
        drop().click()
        await render()
        expect(click).toHaveBeenCalled()
        expect(document.activeElement).toBe(input())

        input().dispatchEvent(new Event('cancel'))
        await render()
        expect(host.control.touched).toBe(true)
    })

    it('should keep focus in the field after removing a file', async () => {
        await dropFiles(file('a.txt', 'text/plain'))
        const remove = drop().querySelector('.file-remove') as HTMLButtonElement
        remove.focus()
        remove.click()
        await render()

        expect(document.activeElement).toBe(input())
        expect(drop().classList).toContain('focused')
    })

    it('should announce added and refused files', async () => {
        host.accept.set('.pdf')
        host.multiple.set(true)
        await render()
        await dropFiles(file('a.pdf', 'application/pdf'), file('b.txt', 'text/plain'))

        const live = drop().querySelector('[aria-live="polite"]')
        expect(live?.textContent?.trim()).toBe("Added a.pdf. Couldn't add b.txt")
    })

    it('should describe its input with the files it has', async () => {
        await dropFiles(file('a.txt', 'text/plain'))

        const ids = input().getAttribute('aria-describedby')?.split(' ') ?? []
        const list = drop().querySelector('.file-list') as HTMLElement
        expect(ids).toContain(list.id)
        expect(list.textContent).toContain('a.txt')
    })

    it('should ignore drops while disabled', async () => {
        host.control.disable()
        await render()
        await dropFiles(file('a.txt', 'text/plain'))

        expect(host.control.value).toBeNull()
        expect(input().disabled).toBe(true)
        expect(drop().classList).toContain('disabled')
    })

    it('should show values that aren\'t files, such as an uploaded file\'s URL', async () => {
        host.control.setValue('https://example.com/uploads/logo.png')
        await render()

        expect(drop().querySelector('.file-name')?.textContent).toBe('logo.png')
    })

    it('should render files with a preview template and object URLs', async () => {
        host.customPreview.set(true)
        await render()
        await dropFiles(file('photo.png', 'image/png'))

        const preview = drop().querySelector('img.preview') as HTMLImageElement
        expect(preview.src).toMatch(/^blob:/)
        expect(drop().querySelector('.file-list')).toBeNull()

        const revoke = vi.spyOn(URL, 'revokeObjectURL')
        preview.click()
        await render()

        expect(host.control.value).toBeNull()
        expect(revoke).toHaveBeenCalledWith(preview.src)
    })

    it('should show validation through nbValidation on its input', async () => {
        host.control.markAsTouched()
        await render()

        expect(drop().classList).toContain('status-danger')
        expect(input().getAttribute('aria-invalid')).toBe('true')
        expect(drop().hasAttribute('aria-invalid')).toBe(false)
    })
})

describe('NbFileDropComponent texts', () => {
    it('should use provided texts', async () => {
        TestBed.configureTestingModule({
            imports: [NbThemeModule.forRoot()],
            providers: [provideNbTexts({ fileDrop: { prompt: 'Spusti datoteko' } })]
        })
        const fixture = TestBed.createComponent(FileDropHostComponent)
        fixture.detectChanges()
        await fixture.whenStable()

        expect(fixture.nativeElement.querySelector('.prompt').textContent.trim()).toBe('Spusti datoteko')
    })
})
