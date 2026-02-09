"use client";
import CommonNavBar from "component/CommonNavBar";
import { Button } from "@heroui/react";
import GoogleIcon from "icons/google.jsx";
import CheckIcon from "icons/check.jsx";
import { useState } from "react";
import { TypingSkillLevel } from "model/UserInfoEntity";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { FireStoreRepository } from "repository/FireStoreRepository";
import { useEffect } from "react";

export default function AuthPage() {
  const [loading, setLoading] = useState(false); // Google認証用
  const [loadingUpdate, setLoadingUpdate] = useState(false); // 決定ボタン用
  const [loadingLogout, setLoadingLogout] = useState(false); // ログアウト用
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastNameKana, setLastNameKana] = useState("");
  const [firstNameKana, setFirstNameKana] = useState("");
  const [typingSkillLevel, setTypingSkillLevel] = useState<TypingSkillLevel | null>(null);
  // 追加アンケート
  const [webSkill, setWebSkill] = useState("");
  const [programmingExp, setProgrammingExp] = useState("");
  const [aiServices, setAiServices] = useState<string[]>([]);
  const [aiUsage, setAiUsage] = useState("");
  const [projectExpect, setProjectExpect] = useState("");
  useEffect(() => {
    (async () => {
      await FirebaseAuthRepository.initialize();
      const isLoggedIn = !!FirebaseAuthRepository.uid;
      setLoggedIn(isLoggedIn);
      setEmail(isLoggedIn ? FirebaseAuthRepository.email : null);
      if (isLoggedIn && FirebaseAuthRepository.uid) {
        // Firestoreからユーザー情報取得
        const userInfo = await FireStoreRepository.getUserInfo(FirebaseAuthRepository.uid);
        if (userInfo) {
          setLastName(userInfo.lastName || "");
          setFirstName(userInfo.firstName || "");
          setLastNameKana(userInfo.lastNameKana || "");
          setFirstNameKana(userInfo.firstNameKana || "");
          setTypingSkillLevel(userInfo.typingSkillLevel || null);
          setWebSkill(userInfo.webSkill || "");
          setProgrammingExp(userInfo.programmingExp || "");
          setAiServices(userInfo.aiServices || []);
          setAiUsage(userInfo.aiUsage || "");
          setProjectExpect(userInfo.projectExpect || "");
        } else {
          setLastName("");
          setFirstName("");
          setLastNameKana("");
          setFirstNameKana("");
          setTypingSkillLevel(null);
          setWebSkill("");
          setProgrammingExp("");
          setAiServices([]);
          setAiUsage("");
          setProjectExpect("");
        }
      }
    })();
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
        // 存在しなければ新規登録（空でOK）
        await FireStoreRepository.createUserInfo(uid, email, null, null, null, null, null);
      }
      setEmail(email);
      setSuccess(true);
      setLoggedIn(true);
    } catch (e) {
      setError("ユーザー情報の登録に失敗しました");
      setLoggedIn(false);
    }
    setLoading(false);
  };

  // ユーザー情報更新
  const handleUpdateUserInfo = async () => {
    if (!FirebaseAuthRepository.uid || !email) return;
    setLoadingUpdate(true);
    setError(null);
    try {
      await FireStoreRepository.updateUserInfo(FirebaseAuthRepository.uid, {
        lastName,
        firstName,
        lastNameKana,
        firstNameKana,
        typingSkillLevel,
        webSkill,
        programmingExp,
        aiServices,
        aiUsage,
        projectExpect,
      });
      setSuccess(true);
    } catch (e) {
      setError("ユーザー情報の更新に失敗しました");
    }
    setLoadingUpdate(false);
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    setError(null);
    const result = await FirebaseAuthRepository.logout();
    if (result) {
      setError(result);
    } else {
      setLoggedIn(false);
      setSuccess(false);
    }
    setLoadingLogout(false);
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
              <div className="mt-4 text-center text-base font-semibold">
                {email && <span>メールアドレス: {email}</span>}
              </div>
              <div className="mt-8 mb-4 text-lg font-bold text-left text-neutral-700">事前アンケート</div>
              <label className="block text-md font-semibold mb-2">① お名前を教えてください</label>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">姓</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!loggedIn}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">名</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!loggedIn}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">姓（ふりがな）</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={lastNameKana}
                    onChange={(e) => setLastNameKana(e.target.value)}
                    disabled={!loggedIn}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">名（ふりがな）</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={firstNameKana}
                    onChange={(e) => setFirstNameKana(e.target.value)}
                    disabled={!loggedIn}
                  />
                </div>
              </div>
              <div className="mt-8">
                <label className="block text-md font-semibold mb-2">② タイピングはできますか？</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="typingSkillLevel"
                      value={TypingSkillLevel.BlindTouch}
                      checked={typingSkillLevel === TypingSkillLevel.BlindTouch}
                      onChange={() => setTypingSkillLevel(TypingSkillLevel.BlindTouch)}
                      disabled={!loggedIn}
                    />
                    ブラインドタッチができる
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="typingSkillLevel"
                      value={TypingSkillLevel.KeyboardLooking}
                      checked={typingSkillLevel === TypingSkillLevel.KeyboardLooking}
                      onChange={() => setTypingSkillLevel(TypingSkillLevel.KeyboardLooking)}
                      disabled={!loggedIn}
                    />
                    キーボードを見ながら、タイピングできる
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="typingSkillLevel"
                      value={TypingSkillLevel.KeyboardAndChart}
                      checked={typingSkillLevel === TypingSkillLevel.KeyboardAndChart}
                      onChange={() => setTypingSkillLevel(TypingSkillLevel.KeyboardAndChart)}
                      disabled={!loggedIn}
                    />
                    キーボードとローマ字表を見ながら、タイピングできる
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="typingSkillLevel"
                      value={TypingSkillLevel.NotSure}
                      checked={typingSkillLevel === TypingSkillLevel.NotSure}
                      onChange={() => setTypingSkillLevel(TypingSkillLevel.NotSure)}
                      disabled={!loggedIn}
                    />
                    タイピングが何のことか分からない
                  </label>
                </div>
              </div>
              {/* ③ HTML・CSS・JavaScriptは知っていますか？ */}
              <div className="mt-8">
                <label className="block text-md font-semibold mb-2">③ HTML・CSS・JavaScriptは知っていますか？</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="webSkill"
                      value="write"
                      checked={webSkill === "write"}
                      onChange={() => setWebSkill("write")}
                      disabled={!loggedIn}
                    />
                    書いたことがある、使ったことがある
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="webSkill"
                      value="somewhat"
                      checked={webSkill === "somewhat"}
                      onChange={() => setWebSkill("somewhat")}
                      disabled={!loggedIn}
                    />
                    何のことか、なんとなく知っている
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="webSkill"
                      value="nameOnly"
                      checked={webSkill === "nameOnly"}
                      onChange={() => setWebSkill("nameOnly")}
                      disabled={!loggedIn}
                    />
                    名称を聞いたことはある
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="webSkill"
                      value="none"
                      checked={webSkill === "none"}
                      onChange={() => setWebSkill("none")}
                      disabled={!loggedIn}
                    />
                    聞いたことない
                  </label>
                </div>
              </div>

              {/* ④ プログラミング経験 */}
              <div className="mt-8">
                <label className="block text-md font-semibold mb-2">④ プログラミングをしたことがありますか？</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="programmingExp"
                      value="makeSomething"
                      checked={programmingExp === "makeSomething"}
                      onChange={() => setProgrammingExp("makeSomething")}
                      disabled={!loggedIn}
                    />
                    何かを作ったことがある
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="programmingExp"
                      value="little"
                      checked={programmingExp === "little"}
                      onChange={() => setProgrammingExp("little")}
                      disabled={!loggedIn}
                    />
                    ちょっとやったことがある
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="programmingExp"
                      value="schoolOnly"
                      checked={programmingExp === "schoolOnly"}
                      onChange={() => setProgrammingExp("schoolOnly")}
                      disabled={!loggedIn}
                    />
                    授業などでやったことがあるが、未経験と言っても過言ではない
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="programmingExp"
                      value="none"
                      checked={programmingExp === "none"}
                      onChange={() => setProgrammingExp("none")}
                      disabled={!loggedIn}
                    />
                    プログラミングに関わったことがない
                  </label>
                </div>
              </div>

              {/* ⑤ 使ったことがあるAIサービス */}
              <div className="mt-8">
                <label className="block text-md font-semibold mb-2">
                  ⑤ 使ったことがあるAIサービスを教えてください（複数選択可）
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "ChatGPT", value: "ChatGPT" },
                    { label: "Gemini", value: "Gemini" },
                    { label: "Claude", value: "Claude" },
                    { label: "Copilot", value: "Copilot" },
                    { label: "Sora", value: "Sora" },
                    { label: "Grok", value: "Grok" },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        name="aiServices"
                        value={item.value}
                        checked={aiServices.includes(item.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAiServices([...aiServices, item.value]);
                          } else {
                            setAiServices(aiServices.filter((v) => v !== item.value));
                          }
                        }}
                        disabled={!loggedIn}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* ⑥ AIサービス用途 */}
              <div className="mt-8">
                <label className="block text-md font-semibold mb-2">
                  ⑥ AIサービスを使ったことがある人は、どんな用途で利用したのか、教えてください（自由記述）
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2 bg-white min-h-[80px]"
                  value={aiUsage}
                  onChange={(e) => setAiUsage(e.target.value)}
                  disabled={!loggedIn}
                />
              </div>

              {/* ⑦ 本プロジェクトでしたいこと・期待 */}
              <div className="mt-8">
                <label className="block text-md font-semibold mb-2">
                  ⑦ 本プロジェクトでしたいこと、期待していることを教えてください（自由記述）
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2 bg-white min-h-[80px]"
                  value={projectExpect}
                  onChange={(e) => setProjectExpect(e.target.value)}
                  disabled={!loggedIn}
                />
              </div>
              <Button
                color="primary"
                variant="solid"
                className="mt-8 w-full text-base font-bold"
                onPress={handleUpdateUserInfo}
                isLoading={loadingUpdate}
                disabled={!loggedIn}
              >
                決定
              </Button>
              <Button
                color="secondary"
                variant="solid"
                className="mt-6 mb-20 w-full text-base font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
                onPress={handleLogout}
                isLoading={loadingLogout}
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
