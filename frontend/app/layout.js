import ServerMantineProvider from "./MantineProvider";

export const metadata = {
  title: "är/paikka",
  description: "Suomen siistein r/place -klooni",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Head is automatically populated with metadata from above, no need to touch it, let's go straight to body */}
      <body>
        <ServerMantineProvider>
          {children}
        </ServerMantineProvider>
      </body>
    </html>
  );
}
