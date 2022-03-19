import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";
import Main from "./pages/Main";
import { ThemeProvider } from "styled-components";
import { useTheme } from "./hooks/useTheme";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function Entry() {
  const theme = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Main />
      </ThemeProvider>
    </QueryClientProvider>
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
      <MantineProvider theme={{ colorScheme, primaryColor: "blue" }}>
        <NotificationsProvider position="bottom-right">
          <Entry />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
