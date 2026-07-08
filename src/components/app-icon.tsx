"use client";

import { icons as lucideIcons } from "lucide-react";
import { getLucideIconName } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";

function kebabToPascal(kebab: string): string {
  return kebab.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

interface Props {
  name: string;
  size?: number;
  alt?: string;
  color?: string;
  className?: string;
}

export default function AppIcon({ name, size = 24, alt, color = "currentColor", className = "" }: Props) {
  const lucideName = getLucideIconName(name);
  const pascalName = kebabToPascal(lucideName);
  const IconComp = (lucideIcons as Record<string, LucideIcon>)[pascalName];

  if (!IconComp) {
    console.warn(`AppIcon: Lucide icon "${pascalName}" (from "${name}" → "${lucideName}") not found`);
    return null;
  }

  return (
    <span className={`inline-flex flex-shrink-0 ${className}`} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <IconComp size={size} color={color} strokeWidth={2} />
    </span>
  );
}
