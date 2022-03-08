import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useState } from "react";
import Main from "./pages/Main";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./hooks/useTheme";

function Entry() {
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Main />
      </div>
    </ThemeProvider>
  );
}

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }}>
        <Entry />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
