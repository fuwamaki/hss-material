"use client";

import { useEffect, useState } from "react";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { userContext } from "provider/UserContext";
import { FirebaseConfig } from "repository/FirebaseConfig";
import { Button, Input, Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";

const PASSWORD_KEY = "basic_auth_passed";
const USERNAME = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || "";
const PASSWORD = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || "";

// React ContextをProviders内で利用するためのコンポーネント
export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { setUid, setEmail } = userContext();
  const [isInitialized, setIsInitialized] = useState(false); // 初期化状態を管理
  const [authed, setAuthed] = useState(typeof window !== "undefined" && localStorage.getItem(PASSWORD_KEY) === "true");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      <div className="flex items-center justify-center h-screen relative">
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <Spinner
            color="primary"
            label=""
            size="lg"
          />
        </div>
      </div>
    );
  }

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!USERNAME || !PASSWORD) {
      addToast({ title: "環境変数が設定されていません。", color: "danger" });
      return;
    }
    if (username === USERNAME && password === PASSWORD) {
      localStorage.setItem(PASSWORD_KEY, "true");
      setAuthed(true);
    } else {
      addToast({ title: "IDまたはパスワードが違います。", color: "danger" });
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <form
          onSubmit={handleAuth}
          className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-4 w-80"
        >
          <h2 className="text-lg font-bold text-center">認証</h2>
          <Input
            label="ID"
            type="text"
            value={username}
            onValueChange={setUsername}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onValueChange={setPassword}
          />
          <Button
            color="primary"
            type="submit"
          >
            認証する
          </Button>
        </form>
      </div>
    );
  }

  return <div>{children}</div>;
}
