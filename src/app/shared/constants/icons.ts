/**
 * Maps our internal icon names to Lucide icon names.
 * Usage: <app-icon name="add"></app-icon> renders <lucide-angular name="plus">.
 */
export const ICON_MAP: Record<string, string> = {
  add: 'plus',
  arrow_back: 'arrow-left',
  auto_stories: 'book-open',
  cancel: 'circle-x',
  check: 'check',
  check_circle: 'circle-check-big',
  check_circle_outline: 'circle-check',
  delete: 'trash-2',
  done_all: 'check-check',
  eco: 'leaf',
  edit: 'pen',
  emoji_events: 'trophy',
  error_outline: 'triangle-alert',
  expand_more: 'chevron-down',
  folder: 'folder',
  groups: 'users',
  lightbulb: 'lightbulb',
  lock: 'lock',
  login: 'log-in',
  menu_book: 'book-open',
  military_tech: 'award',
  park: 'trees',
  person: 'user',
  query_stats: 'chart-column',
  restart_alt: 'rotate-ccw',
  spa: 'flower-2',
  stars: 'sparkles',
  sync: 'refresh-cw',
  translate: 'languages',
  trending_up: 'trending-up',
  wb_sunny: 'sun',
};

export function getLucideIconName(name: string): string | null {
  return ICON_MAP[name] ?? null;
}
