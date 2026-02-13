"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
import CommonFooter from "component/CommonFooter";
import { FireStoreAdminRepository } from "repository/FireStoreAdminRepository";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";
import type { UserInfoEntity } from "model/UserInfoEntity";
import type { SubmissionOriginalPlayEntity } from "model/SubmissionOriginalPlayEntity";
import type { SubmissionOriginalSiteEntity } from "model/SubmissionOriginalSiteEntity";
import type { SubmissionQuizEntity } from "model/SubmissionQuizEntity";
import { Select, SelectItem, Spinner, Tab, Tabs, Button } from "@heroui/react";
import { addToast } from "@heroui/toast";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [seasons, setSeasons] = useState<LectureSeasonEntity[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [users, setUsers] = useState<UserInfoEntity[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [playList, setPlayList] = useState<SubmissionOriginalPlayEntity[]>([]);
  const [siteList, setSiteList] = useState<SubmissionOriginalSiteEntity[]>([]);
  const [quizList, setQuizList] = useState<SubmissionQuizEntity[]>([]);
  const unsubscribeUsersRef = useRef<null | (() => void)>(null);

  const fetchSeasons = async () => {
    try {
      const data = await FireStoreAdminRepository.getAllLectureSeason();
      setSeasons(data);
      if (data.length > 0 && !selectedSeasonId) {
        setSelectedSeasonId(data[0].id);
      }
    } catch (e) {
      addToast({ title: "シーズンの取得に失敗しました。", color: "danger" });
    }
  };

  const startUsersListener = () => {
    if (unsubscribeUsersRef.current) {
      unsubscribeUsersRef.current();
    }
    unsubscribeUsersRef.current = FireStoreAdminRepository.getAllUserInfo(
      (data) => {
        setUsers(data);
      },
      () => {
        addToast({ title: "ユーザー情報の取得に失敗しました。", color: "danger" });
      },
    );
  };

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const [plays, sites, quizzes] = await Promise.all([
        FireStoreAdminRepository.getAllSubmissionOriginalPlay(),
        FireStoreAdminRepository.getAllSubmissionOriginalSite(),
        FireStoreAdminRepository.getAllSubmissionQuiz(),
      ]);
      setPlayList(plays);
      setSiteList(sites);
      setQuizList(quizzes);
    } catch (e) {
      addToast({ title: "提出物の取得に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
    startUsersListener();
    fetchSubmissions();
    return () => {
      if (unsubscribeUsersRef.current) {
        unsubscribeUsersRef.current();
      }
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!selectedSeasonId) return [];
    return users.filter((user) => user.seasonId === selectedSeasonId);
  }, [users, selectedSeasonId]);

  useEffect(() => {
    if (!selectedUserId && filteredUsers.length > 0) {
      setSelectedUserId(filteredUsers[0].uid);
    }
  }, [filteredUsers, selectedUserId]);

  const parseTime = (value: unknown) => {
    if (!value) return 0;
    if (value instanceof Date) return value.getTime();
    if (typeof value === "string") return new Date(value).getTime();
    if (typeof value === "object") {
      const obj = value as { toDate?: () => Date; seconds?: number };
      if (typeof obj.toDate === "function") return obj.toDate().getTime();
      if (typeof obj.seconds === "number") return obj.seconds * 1000;
    }
    return 0;
  };

  const getLatestByStudent = <T extends { studentId: string; updatedAt: unknown }>(
    list: T[],
    studentId: string,
  ): T | null => {
    const filtered = list.filter((item) => item.studentId === studentId);
    if (filtered.length === 0) return null;
    return [...filtered].sort((a, b) => parseTime(b.updatedAt) - parseTime(a.updatedAt))[0];
  };

  const selectedPlay = selectedUserId ? getLatestByStudent(playList, selectedUserId) : null;
  const selectedSite = selectedUserId ? getLatestByStudent(siteList, selectedUserId) : null;
  const selectedQuiz = selectedUserId ? getLatestByStudent(quizList, selectedUserId) : null;

  const formatDate = (value: unknown) => {
    if (!value) return "-";
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === "string") return new Date(value).toLocaleString();
    if (typeof value === "object") {
      const obj = value as { toDate?: () => Date; seconds?: number };
      if (typeof obj.toDate === "function") return obj.toDate().toLocaleString();
      if (typeof obj.seconds === "number") return new Date(obj.seconds * 1000).toLocaleString();
    }
    return "-";
  };

  const renderSection = (title: string, body: React.ReactNode) => (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
      <div className="text-lg font-bold text-neutral-800 mb-3">{title}</div>
      {body}
    </div>
  );

  return (
    <AdminAuth>
      <div className="min-h-screen bg-neutral-100 relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <Spinner
              color="primary"
              label=""
              size="lg"
            />
          </div>
        )}
        <AdminNavBar title="提出物管理" />
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="flex-1">
                <div className="text-sm text-neutral-600 mb-2">シーズン選択</div>
                <Select
                  label="シーズン"
                  placeholder="選択してください"
                  selectedKeys={selectedSeasonId ? new Set([selectedSeasonId]) : new Set()}
                  onSelectionChange={(keys) => {
                    if (keys === "all") return;
                    const value = Array.from(keys)[0];
                    setSelectedSeasonId(value ? String(value) : "");
                    setSelectedUserId("");
                  }}
                >
                  {seasons.map((season) => (
                    <SelectItem key={season.id}>{season.name}</SelectItem>
                  ))}
                </Select>
              </div>
              <Button
                variant="flat"
                color="primary"
                onPress={fetchSubmissions}
              >
                更新
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <div className="text-sm text-neutral-600 mb-3">生徒一覧</div>
            {filteredUsers.length === 0 ? (
              <div className="text-sm text-neutral-500">該当する生徒がいません。</div>
            ) : (
              <Tabs
                aria-label="生徒一覧"
                color="primary"
                variant="underlined"
                selectedKey={selectedUserId}
                onSelectionChange={(key) => setSelectedUserId(String(key))}
              >
                {filteredUsers.map((user) => (
                  <Tab
                    key={user.uid}
                    title={`${user.lastName} ${user.firstName}`.trim() || user.email}
                  />
                ))}
              </Tabs>
            )}
          </div>

          {selectedUserId && (
            <div className="space-y-6">
              {renderSection(
                "オリジナル企画",
                selectedPlay ? (
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div>
                      <div className="text-xs text-neutral-500">タイトル</div>
                      <div className="font-semibold text-neutral-800">{selectedPlay.title}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">想定ユーザー</div>
                      <div className="whitespace-pre-line">{selectedPlay.targetUser}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">ユーザーストーリー</div>
                      <div className="whitespace-pre-line">{selectedPlay.userStory}</div>
                    </div>
                    <div className="text-xs text-neutral-400">更新: {formatDate(selectedPlay.updatedAt)}</div>
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500">未提出です。</div>
                ),
              )}

              {renderSection(
                "オリジナルサイト",
                selectedSite ? (
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div>
                      <div className="text-xs text-neutral-500">工夫したポイント</div>
                      <div className="whitespace-pre-line">{selectedSite.keyFeature}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">ソースコード</div>
                      <div className="mt-1 max-h-50 overflow-y-auto whitespace-pre-line text-sm leading-5">
                        {selectedSite.sourceCode}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400">更新: {formatDate(selectedSite.updatedAt)}</div>
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500">未提出です。</div>
                ),
              )}

              {renderSection(
                "共通課題: クイズ",
                selectedQuiz ? (
                  <div className="space-y-3 text-sm text-neutral-700">
                    <div>
                      <div className="text-xs text-neutral-500">工夫したポイント</div>
                      <div className="whitespace-pre-line">{selectedQuiz.keyFeature}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">ソースコード</div>
                      <div className="mt-1 max-h-50 overflow-y-auto whitespace-pre-line text-sm leading-5">
                        {selectedQuiz.sourceCode}
                      </div>
                    </div>
                    <div className="text-xs text-neutral-400">更新: {formatDate(selectedQuiz.updatedAt)}</div>
                  </div>
                ) : (
                  <div className="text-sm text-neutral-500">未提出です。</div>
                ),
              )}
            </div>
          )}
        </div>
        <CommonFooter />
      </div>
    </AdminAuth>
  );
};

export default Page;
