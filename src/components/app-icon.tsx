"use client";

import { icons as lucideIcons } from "lucide-react";
import { getLucideIconName } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";

interface Props {
  name: string;
  size?: number;
  alt?: string;
  color?: string;
  className?: string;
}

export default function AppIcon({ name, size = 24, alt, color = "currentColor", className = "" }: Props) {
  const lucideName = getLucideIconName(name);
  const IconComp = (lucideIcons as Record<string, LucideIcon>)[lucideName];

  if (!IconComp) return null;

  return (
    <span className={`inline-flex flex-shrink-0 ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined}>
      <IconComp size={size} color={color} strokeWidth={2} />
    </span>
  );
}
