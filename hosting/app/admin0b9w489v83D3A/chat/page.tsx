"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
import CommonFooter from "component/CommonFooter";
import { FireStoreAdminRepository } from "repository/FireStoreAdminRepository";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";
import type { UserInfoEntity } from "model/UserInfoEntity";
import { Button, Select, SelectItem, Spinner } from "@heroui/react";
import Link from "next/link";
import { addToast } from "@heroui/toast";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [seasons, setSeasons] = useState<LectureSeasonEntity[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [users, setUsers] = useState<UserInfoEntity[]>([]);
  const unsubscribeUsersRef = useRef<null | (() => void)>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const seasonList = await FireStoreAdminRepository.getAllLectureSeason();
      setSeasons(seasonList);
      if (seasonList.length > 0) {
        setSelectedSeasonId(seasonList[0].id);
      }
      if (unsubscribeUsersRef.current) {
        unsubscribeUsersRef.current();
      }
      unsubscribeUsersRef.current = FireStoreAdminRepository.getAllUserInfo(
        (data) => {
          setUsers(data);
          setIsLoading(false);
        },
        () => {
          addToast({ title: "データの取得に失敗しました。", color: "danger" });
          setIsLoading(false);
        },
      );
    } catch (e) {
      addToast({ title: "データの取得に失敗しました。", color: "danger" });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
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
        <AdminNavBar title="チャット管理" />
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <div className="text-sm text-neutral-600 mb-2">シーズン選択</div>
            <Select
              label="シーズン"
              placeholder="選択してください"
              selectedKeys={selectedSeasonId ? new Set([selectedSeasonId]) : new Set()}
              onSelectionChange={(keys) => {
                if (keys === "all") return;
                const value = Array.from(keys)[0];
                setSelectedSeasonId(value ? String(value) : "");
              }}
            >
              {seasons.map((season) => (
                <SelectItem key={season.id}>{season.name}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold text-neutral-800">生徒一覧</div>
              <div className="text-xs text-neutral-500">{filteredUsers.length}件</div>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="text-sm text-neutral-500">該当する生徒がいません。</div>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <Link
                    key={user.uid}
                    href={`/admin0b9w489v83D3A/chat/detail?studentId=${user.uid}`}
                  >
                    <Button
                      className="w-full justify-between"
                      variant="flat"
                      color="primary"
                    >
                      <span className="font-semibold">{`${user.lastName} ${user.firstName}`.trim() || user.email}</span>
                      <span className="text-xs text-neutral-500">{user.email}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <CommonFooter />
      </div>
    </AdminAuth>
  );
};

export default Page;
