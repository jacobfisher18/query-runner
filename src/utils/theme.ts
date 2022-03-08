import { MantineTheme } from "@mantine/core";

export interface ContextualTheme {
  color: {
    foreground: string;
    background: string;
    backgroundSecondary: string;
    backgroundSecondaryHover: string;
    highlight: string;
  };
}

const getLightTheme = (t: MantineTheme): ContextualTheme => {
  return {
    color: {
      foreground: t.colors.gray[9],
      background: t.colors.gray[0],
      backgroundSecondary: t.colors.gray[1],
      backgroundSecondaryHover: t.colors.gray[2],
      highlight: t.colors.gray[2],
    },
  };
};

const getDarkTheme = (t: MantineTheme): ContextualTheme => {
  return {
    color: {
      foreground: t.colors.dark[0],
      background: t.colors.dark[7],
      backgroundSecondary: t.colors.dark[8],
      backgroundSecondaryHover: t.colors.dark[9],
      highlight: t.colors.dark[5],
    },
  };
};

export const mapTheme = (t: MantineTheme): MantineTheme & ContextualTheme => {
  return {
    ...t,
    ...(t.colorScheme === "dark" ? getDarkTheme(t) : getLightTheme(t)),
  };
};
