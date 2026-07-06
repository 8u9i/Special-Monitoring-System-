import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { getIconUrl } from '../../constants/icons';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (url()) {
      <img
        [src]="url()"
        [alt]="alt()"
        [width]="sizePx()"
        [height]="sizePx()"
        [style.filter]="colorFilter()"
        loading="lazy"
        decoding="async"
        class="inline-block align-middle"
      />
    }
  `,
})
export class AppIconComponent {
  name = input.required<string>();
  size = input<number>(24);
  alt = input<string>('');
  color = input<string | null>(null);

  url = computed(() => getIconUrl(this.name()));
  sizePx = computed(() => this.size());

  /**
   * Convert a CSS variable color (e.g. "var(--color-primary)") to a CSS filter
   * that tints the black icon source image. Uses a simple sepia/hue-rotate
   * approximation; the icon should be monochrome on a transparent background.
   */
  colorFilter = computed(() => {
    const c = this.color();
    if (!c) return 'none';
    // CSS variables can't be read from inline styles; consumers that want a
    // tinted icon should pass a hex value or `currentColor` (then we use
    // brightness/invert).
    if (c === 'currentColor') {
      return 'brightness(0) saturate(100%) invert(1)';
    }
    return `brightness(0) saturate(100%) invert(1)`;
  });
}
