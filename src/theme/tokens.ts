/**
 * Brand tokens, taken from the web (salfa.app). The UI stays neutral: ink,
 * one blue, one yellow; colour comes from the products themselves.
 */
export const color = {
  blue: "#1447FF",
  blueInk: "#0F36C2",
  yellow: "#FFCE1F",
  yellowInk: "#4A3800",
  amber: "#F4AE45",
  ink: "#0E1330",
  muted: "#5D6285",
  line: "#E9EBF5",
  bg: "#F7F8FC",
  surface: "#FFFFFF",
  navy: "#17213E",
  success: "#12634A",
  successBg: "#E8F7EF",
} as const;

export const radius = { card: 22, btn: 16, pill: 999, input: 14 } as const;

export const shadow = {
  card: {
    shadowColor: "#0E1330",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cta: {
    shadowColor: "#1447FF",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
} as const;

/** Occasion tiles: the colour of the product, not of the UI. */
export const occasionColors: Record<string, { from: string; to: string; ink: string }> = {
  travel: { from: "#1F3FD6", to: "#17213E", ink: "#FFFFFF" },
  birthday: { from: "#FFC93C", to: "#F2A20C", ink: "#4A3800" },
  baby: { from: "#7FA6FF", to: "#4C7CF5", ink: "#FFFFFF" },
  family: { from: "#3EBF84", to: "#12634A", ink: "#FFFFFF" },
  anniversary: { from: "#FF8DA6", to: "#E5476B", ink: "#FFFFFF" },
  artwork: { from: "#FFE37A", to: "#FFC93C", ink: "#4A3800" },
};

/** Cover palette, same 15 pairs as the web's photo covers: [background, ink]. */
export const coverPalette: [string, string][] = [
  ["#FFFFFF", "#17213E"],
  ["#17213E", "#FFFFFF"],
  ["#FFDC35", "#17213E"],
  ["#1263DC", "#FFFFFF"],
  ["#E8CBD6", "#4B2034"],
  ["#FF82B0", "#45152D"],
  ["#B9E3FF", "#143B64"],
  ["#A9E4D2", "#174B43"],
  ["#12634A", "#FFFFFF"],
  ["#D7C6F3", "#40226B"],
  ["#713AB5", "#FFFFFF"],
  ["#FF9470", "#542415"],
  ["#B21839", "#FFFFFF"],
  ["#CBD0D9", "#17213E"],
  ["#262626", "#FFFFFF"],
];
