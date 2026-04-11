import { themeTokens } from '@rh-ponto/config';

export const cssVariables = {
  '--background': themeTokens.colors.background,
  '--foreground': themeTokens.colors.foreground,
  '--card': themeTokens.colors.card,
  '--card-foreground': themeTokens.colors.cardForeground,
  '--muted': themeTokens.colors.muted,
  '--muted-foreground': themeTokens.colors.mutedForeground,
  '--primary': themeTokens.colors.primary,
  '--primary-foreground': themeTokens.colors.primaryForeground,
  '--secondary': themeTokens.colors.secondary,
  '--secondary-foreground': themeTokens.colors.secondaryForeground,
  '--accent': themeTokens.colors.accent,
  '--accent-foreground': themeTokens.colors.accentForeground,
  '--destructive': themeTokens.colors.destructive,
  '--border': themeTokens.colors.border,
  '--input': themeTokens.colors.input,
  '--ring': themeTokens.colors.ring,
  '--radius-sm': themeTokens.radius.sm,
  '--radius-md': themeTokens.radius.md,
  '--radius-lg': themeTokens.radius.lg,
} as const;

