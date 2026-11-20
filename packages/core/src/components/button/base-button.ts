import {
  AfterContentChecked,
  ChangeDetectorRef,
  computed,
  contentChildren,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  inject,
  input,
  linkedSignal,
  Signal,
  signal,
  numberAttribute,
} from '@angular/core';

import { injectNbDefaults } from '@liquid-js/lyr-core/base';
import { NbStatusService } from '@liquid-js/lyr-core/base';
import { ɵconvertToBoolProperty as convertToBoolProperty, NbBooleanInput } from '@liquid-js/lyr-core/base';
import { NbComponentSize } from '@liquid-js/lyr-core/base';
import { NbComponentOrCustomStatus } from '@liquid-js/lyr-core/base';
import { NbComponentShape } from '@liquid-js/lyr-core/base';
import { ɵNbIconRef as NbIconRef } from '@liquid-js/lyr-core/icon';
import { NB_BUTTON_GROUP } from '../button-group/button-group-injection-tokens';
import { ɵenableTransitionsAfterRender as enableTransitionsAfterRender } from '@liquid-js/lyr-core/base';
import type { NbButtonAppearance } from '@liquid-js/lyr-core/base';

/** The side of a button that lines up with the content around it, as `edge` sets it. */
export type NbButtonEdge = 'start' | 'end';

export interface NbButtonProperties {
  appearance: NbButtonAppearance;
  size: NbComponentSize;
  shape: NbComponentShape;
  status: NbComponentOrCustomStatus;
  disabled: boolean;
}

/**
 * Properties shared by buttons and button toggles. Inside `nb-button-group`, the group's `appearance`, `size`,
 * `shape` and `status` replace the button's own, and the button is disabled when either of them is.
 */
@Directive({
  host: {
    '[class]': 'hostClasses()',
    '[class.full-width]': 'fullWidth()',
    '[class.icon-start]': 'iconStart()',
    '[class.icon-end]': 'iconEnd()',
    '[class.edge-start]': "edge() === 'start'",
    '[class.edge-end]': "edge() === 'end'",
    '[class.btn-inline]': 'inline()',
    '[class.btn-disabled]': 'properties().disabled',
    '[class.btn-loading]': 'isBusy()',
    '[attr.aria-busy]': 'isBusy() || null',
    '[attr.aria-disabled]': 'properties().disabled || isBusy()',
    '[attr.disabled]': 'properties().disabled || null',
    // A disabled button is skipped by Tab.
    '[attr.tabindex]': 'tabbable()',
  },
})
export abstract class NbButton<A extends NbButtonAppearance = NbButtonAppearance>
implements AfterContentChecked {
  // The app's defaults for this type, which the inputs below start from.
  protected readonly nbDefaults = injectNbDefaults('button');

  protected readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly cd = inject(ChangeDetectorRef);
  protected readonly statusService = inject(NbStatusService);
  protected readonly group = inject(NB_BUTTON_GROUP, { optional: true });

  /**
   * Button size: `tiny`, `small`, `medium`, `large` or `giant`. Unset, it follows the app's default, or `medium`.
   */
  readonly sizeInput = input<NbComponentSize | undefined>(undefined, { alias: 'size' });
  /** The size in use: the input's, the app's default, or 'medium'. */
  readonly size = linkedSignal<NbComponentSize>(() => this.sizeInput() ?? this.nbDefaults().size ?? 'medium');

  /**
   * Button status: `basic` (default), `primary`, `info`, `success`, `warning`, `danger`, `control` or a custom one.
   */
  readonly status = input<NbComponentOrCustomStatus>('basic');

  /**
   * Button shape: `rectangle`, `semi-round` or `round`. Unset, it follows the app's default, or `rectangle`.
   */
  readonly shapeInput = input<NbComponentShape | undefined>(undefined, { alias: 'shape' });
  /** The shape in use: the input's, the app's default, or 'rectangle'. */
  readonly shape = linkedSignal<NbComponentShape>(() => this.shapeInput() ?? this.nbDefaults().shape ?? 'rectangle');

  /**
   * Button appearance: `filled`, `outline`, `ghost` or, for `nbButton` only, `hero`. Unset, it follows the app's
   * default, or `filled`.
   */
  readonly appearanceInput = input<A | undefined>(undefined, { alias: 'appearance' });
  /** The appearance in use: the input's, or the app's default for buttons, or `filled`. */
  readonly appearance = linkedSignal<A>(
    () => this.appearanceInput() ?? this.defaultAppearance(this.nbDefaults().appearance),
  );

  /**
   * Sets the `filled` appearance, over `appearance`.
   */
  readonly filled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Sets the `outline` appearance, over `appearance` and `filled`.
   */
  readonly outline = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Sets the `ghost` appearance, over `appearance`, `filled` and `outline`.
   */
  readonly ghost = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Fills the width of the container.
   */
  readonly fullWidth = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Lines up the button's label or icon, instead of its box, with the content around it, at its `start` or `end`: the
   * button reaches past that side by as much as its content is inset, e.g. a ghost button at the end of a card header,
   * whose icon then ends where the header's text does. It follows the page's direction, and the button's size.
   */
  readonly edge = input<NbButtonEdge>();

  /**
   * Takes no more room in a row than its label does, as text would: its box reaches above and below into the space
   * around it, e.g. in a card header, which then is as tall as with its title alone. For a ghost button, whose box shows
   * only when hovered or pressed; with `edge`, it lines up as text would on every side.
   */
  readonly inline = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Disables the button, an `a` too: it ignores clicks, is skipped by Tab and is `aria-disabled`.
   */
  readonly disabled = input<boolean, NbBooleanInput>(false, { transform: convertToBoolProperty });

  /**
   * Tabindex of the button, e.g. `tabIndex="-1"`, as a select's.
   */
  readonly tabIndex = input<number | undefined, unknown>(undefined, {
    transform: (value: unknown) => (value == null || value === '' ? undefined : numberAttribute(value)),
  });

  /**
   * The properties the button renders with: its own, or its group's.
   */
  readonly properties: Signal<NbButtonProperties> = computed(() => {
    const groupProperties = this.group?.buttonProperties();
    if (groupProperties) {
      return { ...groupProperties, disabled: groupProperties.disabled || this.disabled() };
    }
    return {
      appearance: this.appearanceFlag() ?? this.appearance(),
      size: this.size(),
      shape: this.shape(),
      status: this.status(),
      disabled: this.disabled(),
    };
  });

  /** The appearance the button starts with: the app's default for buttons, or `filled`. */
  protected defaultAppearance(appearance?: NbButtonAppearance): A {
    return (appearance ?? 'filled') as A;
  }

  protected readonly icons = contentChildren(NbIconRef, { read: ElementRef });
  protected readonly iconStart = signal(false);
  protected readonly iconEnd = signal(false);

  protected readonly tabbable = computed(() => {
    if (this.properties().disabled) {
      return '-1';
    }
    return String(this.tabIndex() ?? 0);
  });

  protected readonly hostClasses = computed(() => {
    const { appearance, size, shape } = this.properties();
    const classes = [`appearance-${appearance}`, `size-${size}`, `shape-${shape}`, ...this.statusClasses()];
    return classes.filter(Boolean);
  });

  /**
   * The appearance set with a boolean input such as `outline`, if any.
   */
  protected appearanceFlag(): NbButtonAppearance | undefined {
    if (this.ghost()) {
      return 'ghost';
    }
    if (this.outline()) {
      return 'outline';
    }
    if (this.filled()) {
      return 'filled';
    }
    return undefined;
  }

  /**
   * Whether the button is busy with an action: it shows a spinner and ignores clicks, but stays focusable.
   */
  protected isBusy() {
    return false;
  }

  protected statusClasses(): (string | undefined)[] {
    return [this.statusService.getStatusClass(this.properties().status)];
  }

  constructor() {
    enableTransitionsAfterRender(this.hostElement.nativeElement);
  }

  ngAfterContentChecked() {
    // Runs before the host bindings are checked, so they see the icons the content renders this time.
    const nodes = this.nodes;
    this.iconStart.set(this.isIconExist(nodes[0]));
    this.iconEnd.set(this.isIconExist(nodes[nodes.length - 1]));
  }

  get iconElement() {
    const el = this.hostElement.nativeElement;
    return el.querySelector('nb-icon');
  }

  protected get nodes(): Node[] {
    // The change detector of a component is its host view.
    const view = this.cd as EmbeddedViewRef<unknown>;
    return view.rootNodes.filter((child: Node) => child.nodeType !== Node.COMMENT_NODE);
  }

  protected isIconExist(node: Node): boolean {
    return this.icons().some((item) => item.nativeElement === node);
  }
}
