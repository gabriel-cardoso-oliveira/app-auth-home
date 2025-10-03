import { config } from "@tamagui/config/v3";
import { createFont, createTamagui, createTokens } from "tamagui";

const tokens = createTokens({
  ...config.tokens,
  color: {
    ...config.tokens.color,
    background: "#F9FAFC",
    cardBorder: "#E5E5E5",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    primary: "#080e4a",
  },
});

const fonts = {
  heading: createFont({
    family: "Inter",
    size: { 4: 20, 5: 24, 6: 30 },
    weight: { 4: "600", 5: "700", 6: "800" },
  }),
  body: createFont({
    family: "Inter",
    size: { 4: 14, 5: 16, 6: 18 },
    weight: { 4: "400", 5: "500" },
  }),
};

export const tamaguiConfig = createTamagui({
  ...config,
  tokens,
  fonts,
  themes: {
    light: {
      background: tokens.color.background,
      borderColor: tokens.color.cardBorder,
      color: tokens.color.textPrimary,
      primary: tokens.color.primary,
    },
  },
});

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends Conf {}
}
