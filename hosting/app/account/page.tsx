"use client";
import CommonNavBar from "component/CommonNavBar";
import CommonFooter from "component/CommonFooter";
import {
  Button,
  Spinner,
  addToast,
  cn,
  Input,
  Textarea,
  Radio,
  Checkbox,
  RadioGroup,
  Select,
  SelectItem,
  type Selection,
} from "@heroui/react";
import GoogleIcon from "icons/google.jsx";
import CheckIcon from "icons/check.jsx";
import { useState, useEffect } from "react";
import { TypingSkillLevel } from "enum/TypingSkillLevel";
import { FirebaseAuthRepository } from "repository/FirebaseAuthRepository";
import { FireStoreRepository } from "repository/FireStoreRepository";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";

export default function AuthPage() {
  const [loading, setLoading] = useState(false); // Google認証用
  const [loadingUpdate, setLoadingUpdate] = useState(false); // 決定ボタン用
  const [loadingLogout, setLoadingLogout] = useState(false); // ログアウト用
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<LectureSeasonEntity[]>([]);
  const [selectedSeasonKeys, setSelectedSeasonKeys] = useState<Set<string>>(new Set());
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
  const isLoading = loading || loadingUpdate || loadingLogout;
  const selectedSeasonId = selectedSeasonKeys.values().next().value;
  const isFormValid =
    !!selectedSeasonId &&
    lastName.trim().length > 0 &&
    firstName.trim().length > 0 &&
    lastNameKana.trim().length > 0 &&
    firstNameKana.trim().length > 0 &&
    typingSkillLevel !== null &&
    webSkill.trim().length > 0 &&
    programmingExp.trim().length > 0 &&
    projectExpect.trim().length > 0;

  // UserInfo取得後の状態セット
  const setUserInfo = (userInfo: any) => {
    if (userInfo) {
      if (userInfo.seasonId) {
        setSelectedSeasonKeys(new Set([userInfo.seasonId]));
      }
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
  };

  // シーズンリストとデフォルト選択セット
  const setSeasonsAndDefaultSelection = (seasonList: LectureSeasonEntity[]) => {
    setSeasons(seasonList);
    if (seasonList.length > 0) {
      const lastSeason = seasonList[seasonList.length - 1];
      setSelectedSeasonKeys(new Set([lastSeason.id]));
    }
  };

  useEffect(() => {
    (async () => {
      await FirebaseAuthRepository.initialize();
      const isLoggedIn = !!FirebaseAuthRepository.uid;
      setLoggedIn(isLoggedIn);
      setEmail(isLoggedIn ? FirebaseAuthRepository.email : null);
      if (isLoggedIn) {
        const seasonList = await FireStoreRepository.getActiveLectureSeasons();
        setSeasonsAndDefaultSelection(seasonList);
      }
      if (isLoggedIn && FirebaseAuthRepository.uid) {
        // Firestoreからユーザー情報取得
        const userInfo = await FireStoreRepository.getUserInfo(FirebaseAuthRepository.uid);
        setUserInfo(userInfo);
      }
    })();
  }, []);

  const handleSeasonSelectionChange = (keys: Selection) => {
    if (keys === "all") return;
    const nextKeys = new Set<string>();
    keys.forEach((key) => nextKeys.add(String(key)));
    setSelectedSeasonKeys(nextKeys);
  };

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
      // シーズンリスト取得・セット
      const seasonList = await FireStoreRepository.getActiveLectureSeasons();
      setSeasonsAndDefaultSelection(seasonList);
      let userInfo = await FireStoreRepository.getUserInfo(uid);
      if (!userInfo) {
        // 存在しなければ新規登録（空でOK）
        await FireStoreRepository.createUserInfo(uid, email, null, null, null, null, null);
        userInfo = await FireStoreRepository.getUserInfo(uid);
      }
      setEmail(email);
      setSuccess(true);
      setLoggedIn(true);
      setUserInfo(userInfo);
      addToast({ title: "ログインに成功しました。", color: "success" });
    } catch (e) {
      setError("ユーザー情報の登録に失敗しました");
      setLoggedIn(false);
    }
    setLoading(false);
  };

  // ユーザー情報更新
  const handleUpdateUserInfo = async () => {
    if (!FirebaseAuthRepository.uid || !email) return;
    if (!isFormValid) {
      addToast({ title: "必須項目をすべて入力してください。", color: "warning" });
      return;
    }
    setLoadingUpdate(true);
    setError(null);
    try {
      const selectedSeason = seasons.find((s) => s.id === selectedSeasonId) || null;
      await FireStoreRepository.updateUserInfo(FirebaseAuthRepository.uid, {
        seasonId: selectedSeason?.id,
        seasonName: selectedSeason?.name,
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
      addToast({
        title: "事前アンケートを送信しました。いつでも内容を更新できます。",
        color: "success",
        classNames: {
          base: cn(["break-words", "whitespace-pre-line"]),
          title: cn(["whitespace-pre-line", "break-words", "text-wrap"]),
        },
      });
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
      addToast({ title: "ログアウトしました。", color: "success" });
    }
    setLoadingLogout(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <Spinner
            color="primary"
            label=""
            size="lg"
          />
        </div>
      )}
      <CommonNavBar title="アカウント" />
      <div className="flex justify-center mt-12">
        <div className="w-full max-w-6xl mx-2">
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
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mt-8 mb-4">
                <div className="text-lg font-bold text-neutral-800 mb-4">事前アンケート</div>
                <div className="mb-6">
                  <Select
                    label="受講シーズン"
                    placeholder="選択してください"
                    selectedKeys={selectedSeasonKeys}
                    onSelectionChange={handleSeasonSelectionChange}
                    disabled={!loggedIn}
                    isRequired
                  >
                    {seasons.map((season) => (
                      <SelectItem key={season.id}>{season.name}</SelectItem>
                    ))}
                  </Select>
                </div>
                <label className="block text-md font-semibold mb-2">
                  1. お名前を教えてください
                  <span className="ml-2 text-xs text-rose-600">*</span>
                </label>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!loggedIn}
                      label="姓"
                      placeholder="例：山田"
                      isRequired
                    />
                  </div>
                  <div>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!loggedIn}
                      label="名"
                      placeholder="例：太郎"
                      isRequired
                    />
                  </div>
                  <div>
                    <Input
                      id="lastNameKana"
                      type="text"
                      value={lastNameKana}
                      onChange={(e) => setLastNameKana(e.target.value)}
                      disabled={!loggedIn}
                      label="姓（ふりがな）"
                      placeholder="例：やまだ"
                      isRequired
                    />
                  </div>
                  <div>
                    <Input
                      id="firstNameKana"
                      type="text"
                      value={firstNameKana}
                      onChange={(e) => setFirstNameKana(e.target.value)}
                      disabled={!loggedIn}
                      label="名（ふりがな）"
                      placeholder="例：たろう"
                      isRequired
                    />
                  </div>
                </div>
                <div className="mt-8">
                  <label className="block text-md font-semibold mb-2">
                    2. タイピングはできますか？
                    <span className="ml-2 text-xs text-rose-600">*</span>
                  </label>
                  <RadioGroup
                    name="typingSkillLevel"
                    value={typingSkillLevel ? String(typingSkillLevel) : ""}
                    onChange={(e) => setTypingSkillLevel(e.target.value ? Number(e.target.value) : null)}
                    isDisabled={!loggedIn}
                    className="flex flex-col gap-2"
                    isRequired
                  >
                    <Radio value={String(TypingSkillLevel.BlindTouch)}>ブラインドタッチができる</Radio>
                    <Radio value={String(TypingSkillLevel.KeyboardLooking)}>
                      キーボードを見ながら、タイピングできる
                    </Radio>
                    <Radio value={String(TypingSkillLevel.KeyboardAndChart)}>
                      キーボードとローマ字表を見ながら、タイピングできる
                    </Radio>
                    <Radio value={String(TypingSkillLevel.NotSure)}>タイピングが何のことか分からない</Radio>
                  </RadioGroup>
                </div>
                {/* 3. HTML・CSS・JavaScriptは知っていますか？ */}
                <div className="mt-8">
                  <label className="block text-md font-semibold mb-2">
                    3. HTML・CSS・JavaScriptは知っていますか？
                    <span className="ml-2 text-xs text-rose-600">*</span>
                  </label>
                  <RadioGroup
                    name="webSkill"
                    value={webSkill}
                    onChange={(e) => setWebSkill(e.target.value)}
                    isDisabled={!loggedIn}
                    className="flex flex-col gap-2"
                    isRequired
                  >
                    <Radio value="write">書いたことがある、使ったことがある</Radio>
                    <Radio value="somewhat">何のことか、なんとなく知っている</Radio>
                    <Radio value="nameOnly">名称を聞いたことはある</Radio>
                    <Radio value="none">聞いたことない</Radio>
                  </RadioGroup>
                </div>

                {/* 4. プログラミング経験 */}
                <div className="mt-8">
                  <label className="block text-md font-semibold mb-2">
                    4. プログラミングをしたことがありますか？
                    <span className="ml-2 text-xs text-rose-600">*</span>
                  </label>
                  <RadioGroup
                    name="programmingExp"
                    value={programmingExp}
                    onChange={(e) => setProgrammingExp(e.target.value)}
                    isDisabled={!loggedIn}
                    className="flex flex-col gap-2"
                    isRequired
                  >
                    <Radio value="makeSomething">何かを作ったことがある</Radio>
                    <Radio value="little">ちょっとやったことがある</Radio>
                    <Radio value="schoolOnly">授業などでやったことがあるが、未経験と言っても過言ではない</Radio>
                    <Radio value="none">プログラミングに関わったことがない</Radio>
                  </RadioGroup>
                </div>

                {/* 5. 使ったことがあるAIサービス */}
                <div className="mt-8">
                  <label className="block text-md font-semibold mb-2">
                    5. 使ったことがあるAIサービスを教えてください（複数選択可）
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
                      <Checkbox
                        key={item.value}
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
                      >
                        {item.label}
                      </Checkbox>
                    ))}
                  </div>
                </div>

                {/* 6. AIサービス用途 */}
                <div className="mt-8">
                  <label className="block text-md font-semibold mb-2">
                    6. AIサービスを使ったことがある人は、どんな用途で利用したのか、教えてください（自由記述）
                  </label>
                  <Textarea
                    className="w-full min-h-20"
                    value={aiUsage}
                    onChange={(e) => setAiUsage(e.target.value)}
                    disabled={!loggedIn}
                  />
                </div>

                {/* 7. 本プロジェクトでしたいこと・期待 */}
                <div className="mt-8">
                  <label className="block text-md font-semibold mb-2">
                    7. 本プロジェクトでしたいこと、期待していることを教えてください（自由記述）
                    <span className="ml-2 text-xs text-rose-600">*</span>
                  </label>
                  <Textarea
                    className="w-full min-h-20"
                    value={projectExpect}
                    onChange={(e) => setProjectExpect(e.target.value)}
                    disabled={!loggedIn}
                    isRequired
                  />
                </div>
                <Button
                  color="primary"
                  variant="solid"
                  className={cn(
                    "mt-8 w-full text-base font-bold",
                    (!loggedIn || !isFormValid) && "bg-neutral-200 border-neutral-300 text-neutral-400",
                  )}
                  onPress={handleUpdateUserInfo}
                  isLoading={loadingUpdate}
                  disabled={!loggedIn || !isFormValid}
                >
                  決定
                </Button>
                <Button
                  color="secondary"
                  variant="solid"
                  className="mt-6 mb-20 w-full text-base font-bold bg-indigo-100 border-1 border-indigo-400 text-indigo-700"
                  onPress={handleLogout}
                  isLoading={loadingLogout}
                  isDisabled={!loggedIn}
                >
                  ログアウト
                </Button>
              </div>
            </>
          )}
          {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
        </div>
      </div>
      <CommonFooter />
    </div>
  );
}
