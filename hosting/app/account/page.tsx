"use client";
import CommonNavBar from "component/CommonNavBar";
import { Button } from "@heroui/react";
import GoogleIcon from "icons/google.jsx";
import CheckIcon from "icons/check.jsx";
import { useState } from "react";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { FireStoreRepository } from "repository/FireStoreRepository";
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
      setLoading(false);
      return;
    }
    // Googleログイン成功後、ユーザー情報がFirestoreに存在するか確認
    try {
      const uid = FirebaseAuthRepository.uid;
      const email = FirebaseAuthRepository.email;
      if (!uid || !email) {
        setError("ユーザー情報の取得に失敗しました");
        setLoading(false);
        return;
      }
      const userInfo = await FireStoreRepository.getUserInfo(uid);
      if (!userInfo) {
        // 存在しなければ新規登録（name, furiganaはnullでOK）
        await FireStoreRepository.createUserInfo(uid, email, null, null);
      }
      setSuccess(true);
      setLoggedIn(true);
    } catch (e) {
      setError("ユーザー情報の登録に失敗しました");
      setLoggedIn(false);
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
      <CommonNavBar title="アカウント" />
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
              {success && <div className="mt-4 text-emerald-600 text-sm text-center">ログインに成功しました！</div>}
            </>
          ) : (
            <>
              <div className="text-emerald-600 text-sm flex items-center justify-center gap-1">
                <CheckIcon />
                <span>ログイン済み</span>
              </div>
              <Button
                color="secondary"
                variant="solid"
                className="mt-6 w-full text-base font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
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
