"use client";
import CommonNavBar from "component/CommonNavBar";
import { Button } from "@heroui/react";
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
    <div>
      <CommonNavBar title="登録・ログイン" />
      <div className="flex justify-center mt-12">
        <div className="w-full max-w-xs">
          {!loggedIn ? (
            <>
              <Button
                color="primary"
                variant="solid"
                className="w-full text-base font-bold"
                onClick={handleGoogleAuth}
                isLoading={loading}
              >
                Googleで登録・ログイン
              </Button>
              {success && <div className="mt-4 text-green-600 text-sm text-center">ログインに成功しました！</div>}
            </>
          ) : (
            <>
              <div className="mb-4 text-green-600 text-sm text-center">ログイン済みです</div>
              <Button
                color="secondary"
                variant="solid"
                className="w-full text-base font-bold"
                onClick={handleLogout}
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
