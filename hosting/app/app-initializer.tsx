"use client";

import { useEffect, useState } from "react";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { userContext } from "provider/UserContext";
import { FirebaseConfig } from "repository/FirebaseConfig";
import { Spinner } from "@heroui/react";

// React ContextをProviders内で利用するためのコンポーネント
export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { setUid, setEmail } = userContext();
  const [isInitialized, setIsInitialized] = useState(false); // 初期化状態を管理

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        await FirebaseConfig.initialize();
        const errorMessage = await FirebaseAuthRepository.initialize();
        if (errorMessage) {
          console.error("Firebase initialization failed:", errorMessage);
        } else {
          setUid(FirebaseAuthRepository.uid);
          if (FirebaseAuthRepository.email) {
            setEmail(FirebaseAuthRepository.email);
          }
        }
      } catch (error) {
        console.error("Unexpected error during Firebase initialization:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeFirebase();
  }, [setUid]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <div>{children}</div>;
}
