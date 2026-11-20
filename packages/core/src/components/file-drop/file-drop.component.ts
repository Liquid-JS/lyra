import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  LOCALE_ID,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { injectNbDefaults } from '@liquid-js/lyr-core/base';
import { NbStatusService } from '@liquid-js/lyr-core/base';
import { NbComponentShape } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbIconComponent } from '@liquid-js/lyr-core/icon';
import { NbValidationDirective } from '@liquid-js/lyr-core/validation';
import { ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base';
import { injectNbTexts, NbLocalize, nbFormatList } from '@liquid-js/lyr-core/base';

/** @internal */
declare const $localize: NbLocalize;

/**
 * Why a file was not added: its type isn't accepted, it's larger than `maxSize`, or it's over `maxFiles`
 * (or a second file for a single-file drop).
 */
export type NbFileRejectionReason = 'type' | 'size' | 'count';

export interface NbFileRejection {
  file: File;
  reason: NbFileRejectionReason;
}

/**
 * What a `nbFileDropPreview` template gets.
 */
export interface NbFileDropPreviewContext<T = unknown> {
  /**
   * The files in the value: the `File`s the user added, and any other items the value was set to,
   * such as the URL of a file that is already uploaded.
   */
  $implicit: T[];
  /**
   * Removes a file from the value.
   */
  remove: (file: T) => void;
  /**
   * A URL to show the file at, e.g. as an image: an object URL for a `File` (revoked when it's removed),
   * the item itself when it's a string, otherwise `undefined`.
   */
  url: (file: T) => string | undefined;
}

/**
 * Shows the files of a `nb-file-drop` in place of its default list, e.g. as image previews.
 *
 * ```html
 * <ng-template nbFileDropPreview let-files let-remove="remove" let-url="url">
 *   @for (file of files; track file) {
 *     <img [src]="url(file)" alt="" />
 *   }
 * </ng-template>
 * ```
 */
@Directive({
  selector: 'ng-template[nbFileDropPreview]',
})
export class NbFileDropPreviewDirective {
  readonly template = inject<TemplateRef<NbFileDropPreviewContext>>(TemplateRef);

  static ngTemplateContextGuard(_dir: NbFileDropPreviewDirective, _ctx: unknown): _ctx is NbFileDropPreviewContext {
    return true;
  }
}

let lastFileDropId = 0;

/**
 * A form control for choosing files by dropping them, pasting them, or picking them in the browser's file dialog.
 *
 * ```html
 * <nb-file-drop formControlName="attachment" accept="image/*,.pdf" />
 * ```
 *
 * @stacked-example(Showcase, file-drop/file-drop-showcase.component)
 *
 * Drop zones come in the same sizes as other fields, which scale their width, spacing, text and buttons:
 * @stacked-example(Sizes, file-drop/file-drop-sizes.component)
 *
 * The value is a `File` (or `null`), or with `multiple` an array of them. Files that don't match `accept`, are larger
 * than `maxSize`, or are over `maxFiles` aren't added; `rejected` tells which and why.
 *
 * @stacked-example(Multiple files and limits, file-drop/file-drop-multiple.component)
 *
 * Show the files your way with a `nbFileDropPreview` template; its `url` gives a URL to show a file at. The value
 * can also hold items that aren't `File`s, such as the URL of an image already uploaded, which the template shows too.
 *
 * @stacked-example(Image preview, file-drop/file-drop-preview.component)
 *
 * The drop zone is operated with the keyboard through a native file input, which also takes the `id` for a label.
 * Add `nbValidation` to show its validation state.
 *
 * @styles
 *
 * file-drop-border-style:
 * file-drop-border-width:
 * file-drop-tiny-padding:
 * file-drop-tiny-min-height:
 * file-drop-tiny-gap:
 * file-drop-tiny-icon-size:
 * file-drop-small-padding:
 * file-drop-small-min-height:
 * file-drop-small-gap:
 * file-drop-small-icon-size:
 * file-drop-medium-padding:
 * file-drop-medium-min-height:
 * file-drop-medium-gap:
 * file-drop-medium-icon-size:
 * file-drop-large-padding:
 * file-drop-large-min-height:
 * file-drop-large-gap:
 * file-drop-large-icon-size:
 * file-drop-giant-padding:
 * file-drop-giant-min-height:
 * file-drop-giant-gap:
 * file-drop-giant-icon-size:
 * file-drop-drag-background-color:
 * file-drop-drag-border-color:
 * file-drop-drag-text-color:
 * file-drop-remove-highlight-color:
 * file-drop-remove-hover-background-color:
 * file-drop-remove-focus-background-color:
 * file-drop-remove-active-background-color:
 * file-drop-remove-outline-width:
 * file-drop-remove-outline-color:
 * file-drop-remove-border-radius:
 */
@Component({
  selector: 'nb-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  imports: [NgTemplateOutlet, NbIconComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NbFileDropComponent), multi: true }],
  host: {
    // The id goes to the native input, which labels point at; the host keeps none, so it isn't duplicated.
    '[attr.id]': 'null',
    '[class]': 'hostClasses()',
    '[class.full-width]': 'fullWidth()',
    // With the default list, the remove buttons sit at the end edge, as a form field's suffix button does.
    '[class.has-file-list]': 'files().length > 0 && !preview()',
    '[class.disabled]': 'isDisabled()',
    '[class.focused]': 'focused()',
    '[class.drag-over]': 'dragOver()',
    '(click)': 'onClick($event)',
    '(dragenter)': 'onDragEnter($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave()',
    '(drop)': 'onDrop($event)',
    '(paste)': 'onPaste($event)',
    // The whole field shows focus, wherever in it the focus is, as a select does.
    '(focusin)': 'focused.set(true)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class NbFileDropComponent implements ControlValueAccessor {
  // The app's defaults for this type, which the inputs below start from.
  protected readonly nbDefaults = injectNbDefaults('fileDrop');

  protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly statusService = inject(NbStatusService);
  protected readonly locale = inject(LOCALE_ID);
  protected readonly texts = injectNbTexts('fileDrop', () => ({
    prompt: $localize`:@@nb.fileDrop.prompt:Drop a file here or click to choose one`,
    promptMultiple: $localize`:@@nb.fileDrop.promptMultiple:Drop files here or click to choose them`,
    dropHere: $localize`:@@nb.fileDrop.dropHere:Drop to add`,
    remove: (name) => $localize`:@@nb.fileDrop.remove:Remove ${name}:name:`,
    added: (names) => $localize`:@@nb.fileDrop.added:Added ${names}:names:`,
    notAdded: (names) => $localize`:@@nb.fileDrop.notAdded:Couldn't add ${names}:names:`,
  }));
  protected readonly validation = inject(NbValidationDirective, { self: true, optional: true });
  protected readonly sizeFormat = new Intl.NumberFormat(inject(LOCALE_ID), { maximumFractionDigits: 1 });

  /**
   * Id of the native file input, for a `<label for>`.
   */
  readonly id = input(`nb-file-drop-${lastFileDropId++}`);

  /**
   * File types to accept, as for a native file input: MIME types (`image/png`), wildcards (`image/*`) and
   * extensions (`.pdf`), separated by commas. Accepts every file when empty.
   */
  readonly accept = input('');

  /**
   * Whether the value is a list of files the user adds to, instead of one file the user replaces.
   */
  readonly multiple = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * The largest file to accept, in bytes.
   */
  readonly maxSize = input<number>();

  /**
   * With `multiple`, the most files the value can hold.
   */
  readonly maxFiles = input<number>();

  /**
   * Scales the drop zone as other fields: `tiny`, `small`, `medium` (default), `large`, `giant`.
   */
  readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' });
  /** The size in use: the input's, the app's default, or 'medium'. */
  readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium');

  /**
   * Status of the drop zone: `basic` (default), `primary`, `success`, `info`, `warning`, `danger`, `control` or a
   * custom one. With `nbValidation`, its error or success status takes over.
   */
  readonly status = input<NbComponentOrCustomStatus>('basic');

  /**
   * Shape of the drop zone: `rectangle`, `semi-round` or `round`. Unset, it follows the app's default, or
   * `rectangle`.
   */
  readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' });
  /** The shape in use: the input's, the app's default, or 'rectangle'. */
  readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'rectangle');

  /**
   * If set, the drop zone fills its container, as other fields do with `fullWidth`.
   */
  readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Disables the drop zone; a form control's disabled state does too.
   */
  readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * What to drop, e.g. "Drop your logo here". Defaults to the `fileDrop` texts of `NbTextsService`.
   */
  readonly prompt = input<string>();

  /**
   * Files the user tried to add that weren't added, and why.
   */
  readonly rejected = output<NbFileRejection[]>();

  protected readonly preview = contentChild(NbFileDropPreviewDirective);
  protected readonly nativeInput = viewChild.required<ElementRef<HTMLInputElement>>('nativeInput');

  /**
   * The files in the value.
   */
  readonly files = signal(new Array<unknown>());

  protected readonly focused = signal(false);
  protected readonly announcement = signal('');
  protected readonly dragOver = signal(false);
  /** Whether it's disabled: the `disabled` input, or the form's disabled state, whichever changed last. */
  readonly isDisabled = linkedSignal(() => this.disabled());

  // With `nbValidation`, the status it gives while the control shows errors or success.
  protected readonly resolvedStatus = computed(() => this.validation?.status() ?? this.status());

  protected readonly hostClasses = computed(() => [
    `size-${this.size()}`,
    this.statusService.getStatusClass(this.resolvedStatus()),
    `shape-${this.shape()}`,
  ]);

  protected readonly resolvedPrompt = computed(
    () => this.prompt() ?? (this.multiple() ? this.texts().promptMultiple : this.texts().prompt),
  );
  protected readonly promptId = computed(() => `${this.id()}-prompt`);
  protected readonly listId = computed(() => `${this.id()}-files`);
  // The prompt says what the input does when there is no label, and the list which files it has; errors from
  // `nbValidation` come after them.
  protected readonly describedBy = computed(() =>
    [this.promptId(), this.files().length && !this.preview() ? this.listId() : '', this.validation?.describedBy()]
      .filter(Boolean)
      .join(' '),
  );

  protected readonly previewContext = computed<NbFileDropPreviewContext>(() => ({
    $implicit: this.files(),
    remove: (file) => this.remove(file),
    url: (file) => this.url(file),
  }));

  // Dragging over child elements fires dragleave on the parent, so count entries to know when the drag really left.
  protected dragDepth = 0;
  protected readonly objectUrls = new Map<File, string>();
  protected onChange: (value: unknown) => void = () => undefined;
  protected onTouched = () => {};

  constructor() {
    this.validation?.delegateAria();
    enableTransitionsAfterRender(this.hostElement.nativeElement);
    inject(DestroyRef).onDestroy(() => this.objectUrls.forEach((url) => URL.revokeObjectURL(url)));
  }

  /**
   * Adds files as if the user dropped them: only the accepted ones, replacing the file of a single-file drop.
   */
  addFiles(candidates: File[]) {
    if (this.isDisabled() || !candidates.length) {
      return;
    }
    const rejections = new Array<NbFileRejection>();
    const accepted = new Array<File>();
    const room = this.multiple() ? (this.maxFiles() ?? Infinity) - this.files().length : 1;
    for (const file of candidates) {
      const reason = this.rejectionReason(file);
      if (reason) {
        rejections.push({ file, reason });
      } else if (accepted.length >= room) {
        rejections.push({ file, reason: 'count' });
      } else {
        accepted.push(file);
      }
    }
    if (accepted.length) {
      if (this.multiple()) {
        this.setFiles([...this.files(), ...accepted]);
      } else {
        this.setFiles(accepted);
      }
    }
    if (rejections.length) {
      this.rejected.emit(rejections);
    }
    // The native input is cleared after each choice, so screen readers would otherwise not hear what happened.
    const names = (files: File[]) => files.map((file) => file.name);
    this.announcement.set(
      [
        accepted.length ? this.texts().added(nbFormatList(this.locale, names(accepted))) : '',
        rejections.length
          ? this.texts().notAdded(nbFormatList(this.locale, names(rejections.map(({ file }) => file))))
          : '',
      ]
        .filter(Boolean)
        .join('. '),
    );
  }

  /**
   * Removes a file from the value, unless the drop zone is disabled.
   */
  remove(file: unknown) {
    if (!this.isDisabled()) {
      this.setFiles(this.files().filter((existing) => existing !== file));
    }
  }

  /**
   * Opens the browser's file dialog.
   */
  open() {
    if (!this.isDisabled()) {
      // Focused, as a click on a field focuses it, so leaving it touches the control, as does cancelling the dialog.
      const field = this.nativeInput().nativeElement;
      field.focus({ preventScroll: true });
      field.click();
    }
  }

  writeValue(value: unknown) {
    this.files.set(value == null ? [] : Array.isArray(value) ? [...value] : [value]);
    this.revokeUnused();
  }

  registerOnChange(fn: (value: unknown) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  protected setFiles(files: unknown[]) {
    this.files.set(files);
    this.revokeUnused();
    this.onChange(this.multiple() ? files : (files[0] ?? null));
    this.onTouched();
  }

  protected url(file: unknown): string | undefined {
    if (typeof file === 'string') {
      return file;
    }
    if (!(file instanceof File)) {
      return undefined;
    }
    let url = this.objectUrls.get(file);
    if (!url) {
      url = URL.createObjectURL(file);
      this.objectUrls.set(file, url);
    }
    return url;
  }

  protected revokeUnused() {
    const files = this.files();
    for (const [file, url] of this.objectUrls) {
      if (!files.includes(file)) {
        URL.revokeObjectURL(url);
        this.objectUrls.delete(file);
      }
    }
  }

  protected rejectionReason(file: File): NbFileRejectionReason | undefined {
    const maxSize = this.maxSize();
    if (!this.isAccepted(file)) {
      return 'type';
    }
    if (maxSize !== undefined && file.size > maxSize) {
      return 'size';
    }
    return undefined;
  }

  // The same rules as the native accept attribute: a file is accepted when it matches any of the entries.
  protected isAccepted(file: File): boolean {
    const entries = this.accept()
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean);
    if (!entries.length) {
      return true;
    }
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();
    return entries.some((entry) => {
      if (entry.startsWith('.')) {
        return name.endsWith(entry);
      }
      if (entry.endsWith('/*')) {
        return type.startsWith(entry.slice(0, -1));
      }
      return type === entry;
    });
  }

  protected formatSize(file: unknown): string {
    if (!(file instanceof File)) {
      return '';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = file.size;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit++;
    }
    return `${this.sizeFormat.format(size)} ${units[unit]}`;
  }

  protected fileName(file: unknown): string {
    if (file instanceof File) {
      return file.name;
    }
    return typeof file === 'string' ? (file.split('/').pop() ?? file) : String(file);
  }

  protected onClick(event: MouseEvent) {
    // Buttons and links in the files, such as remove, do their own thing; the input opens the dialog itself.
    const target = event.target as Element;
    if (target.closest('button, a, input') === null) {
      this.open();
    }
  }

  protected onFocusOut(event: FocusEvent) {
    // Moving between the input and the remove buttons stays inside the field.
    if (!this.hostElement.nativeElement.contains(event.relatedTarget as Node | null)) {
      this.focused.set(false);
      this.onTouched();
    }
  }

  protected onSelected() {
    const nativeInput = this.nativeInput().nativeElement;
    this.addFiles(Array.from(nativeInput.files ?? []));
    // Clear it, so choosing the same file again still reports a change.
    nativeInput.value = '';
  }

  protected onDragEnter(event: DragEvent) {
    if (this.hasFiles(event)) {
      event.preventDefault();
      this.dragDepth++;
      this.dragOver.set(true);
    }
  }

  protected onDragOver(event: DragEvent) {
    if (this.hasFiles(event) && event.dataTransfer) {
      event.preventDefault();
      event.dataTransfer.dropEffect = this.isDisabled() ? 'none' : 'copy';
    }
  }

  protected onDragLeave() {
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (!this.dragDepth) {
      this.dragOver.set(false);
    }
  }

  protected onDrop(event: DragEvent) {
    if (!this.hasFiles(event)) {
      return;
    }
    event.preventDefault();
    this.dragDepth = 0;
    this.dragOver.set(false);
    this.addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  protected onPaste(event: ClipboardEvent) {
    const files = Array.from(event.clipboardData?.files ?? []);
    if (files.length) {
      event.preventDefault();
      this.addFiles(files);
    }
  }

  protected hasFiles(event: DragEvent): boolean {
    return !!event.dataTransfer?.types.includes('Files');
  }
}
