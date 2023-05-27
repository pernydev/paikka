"use client";

import { MantineProvider } from "@mantine/core";

export default function ServerMantineProvider({ children }) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      {children}
    </MantineProvider>
  );
}
