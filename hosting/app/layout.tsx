import "./globals.css";
import { Providers } from "./providers";
import AppInitializer from "./app-initializer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppInitializer>{children}</AppInitializer>
        </Providers>
      </body>
    </html>
  );
}
