"use client";
import { useEffect, useMemo, useState } from "react";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
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

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [seasonList, userList] = await Promise.all([
        FireStoreAdminRepository.getAllLectureSeason(),
        FireStoreAdminRepository.getAllUserInfo(),
      ]);
      setSeasons(seasonList);
      setUsers(userList);
      if (seasonList.length > 0) {
        setSelectedSeasonId(seasonList[0].id);
      }
    } catch (e) {
      addToast({ title: "データの取得に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!selectedSeasonId) return [];
    return users.filter((user) => user.seasonId === selectedSeasonId);
  }, [users, selectedSeasonId]);

  return (
    <AdminAuth>
      <div className="min-h-screen bg-neutral-100 relative">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
            <Spinner
              color="primary"
              label="simple"
              size="lg"
            />
          </div>
        )}
        <AdminNavBar title="チャット管理" />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
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
                    href={`/admin0b9w489v83D3A/chat/${user.uid}`}
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
      </div>
    </AdminAuth>
  );
};

export default Page;
