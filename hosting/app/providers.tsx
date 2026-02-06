"use client";

import { HeroUIProvider } from "@heroui/react";
import { UserProvider } from "provider/UserContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <HeroUIProvider>{children}</HeroUIProvider>
    </UserProvider>
  );
}
