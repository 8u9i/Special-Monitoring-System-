export const AVATAR_MAP: Record<string, string> = {
  'avatar-leaf': '🌿',
  'avatar-mountain': '🏔️',
  'avatar-sun': '☀️',
  'avatar-flower': '🌸',
  'avatar-water': '💧',
  'avatar-shield': '🛡️',
};

export const AVATAR_OPTIONS = [
  { key: 'avatar-leaf', emoji: '🌿', label: 'غصن أخضر' },
  { key: 'avatar-mountain', emoji: '🏔️', label: 'جبل الحكمة' },
  { key: 'avatar-sun', emoji: '☀️', label: 'شمس الهداية' },
  { key: 'avatar-flower', emoji: '🌸', label: 'زهرة الأخلاق' },
  { key: 'avatar-water', emoji: '💧', label: 'غيث المعرفة' },
  { key: 'avatar-shield', emoji: '🛡️', label: 'درع العقيدة' },
];

export function getAvatarEmoji(avatar: string): string {
  return AVATAR_MAP[avatar] || '🌿';
}
