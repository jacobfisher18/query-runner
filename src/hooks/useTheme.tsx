import { MantineTheme, useMantineTheme } from "@mantine/core";
import { ContextualTheme, mapTheme } from "../utils/theme";

export function useTheme(): MantineTheme & ContextualTheme {
  const maintineTheme = useMantineTheme();
  return mapTheme(maintineTheme);
}
