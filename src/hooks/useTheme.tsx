import { MantineTheme, useMantineTheme } from "@mantine/core";
import { ContextualTheme, mapTheme } from "../utils/theme";

export type CustomTheme = MantineTheme & ContextualTheme;

export const getTheme = (input: any) => input.theme as CustomTheme;

export function useTheme(): CustomTheme {
  const maintineTheme = useMantineTheme();
  return mapTheme(maintineTheme);
}
