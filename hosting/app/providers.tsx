"use client";

import { HeroUIProvider } from "@heroui/react";
import { UserProvider } from "provider/UserContext";
import { ToastProvider } from "@heroui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <HeroUIProvider>
        <ToastProvider placement="top-center" />
        {children}
      </HeroUIProvider>
    </UserProvider>
  );
}
