"use client";
import CommonNavBar from "component/CommonNavBar";
import { Button } from "@heroui/react";
import GoogleIcon from "icons/google.jsx";
import { useState } from "react";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { useEffect } from "react";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    FirebaseAuthRepository.initialize().then(() => {
      setLoggedIn(!!FirebaseAuthRepository.uid);
    });
  }, []);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const result = await FirebaseAuthRepository.loginWithGoogle();
    if (result) {
      setError(result);
      setLoggedIn(false);
    } else {
      setSuccess(true);
      setLoggedIn(true);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    const result = await FirebaseAuthRepository.logout();
    if (result) {
      setError(result);
    } else {
      setLoggedIn(false);
      setSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <CommonNavBar title="登録・ログイン" />
      <div className="flex justify-center mt-12">
        <div className="w-full max-w-4xl mx-2">
          {!loggedIn ? (
            <>
              <Button
                color="primary"
                variant="solid"
                className="w-full text-base font-bold flex items-center justify-center gap-2 bg-neutral-100 border-1 border-neutral-400 text-neutral-700"
                onPress={handleGoogleAuth}
                isLoading={loading}
              >
                <span className="w-6 h-6 flex items-center justify-center">
                  <GoogleIcon
                    width={24}
                    height={24}
                  />
                </span>
                Sign in with Google
              </Button>
              {success && <div className="mt-4 text-green-600 text-sm text-center">ログインに成功しました！</div>}
            </>
          ) : (
            <>
              <div className="mb-4 text-green-600 text-sm text-center">ログイン済みです</div>
              <Button
                color="secondary"
                variant="solid"
                className="w-full text-base font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
                onPress={handleLogout}
                isLoading={loading}
              >
                ログアウト
              </Button>
            </>
          )}
          {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
}
