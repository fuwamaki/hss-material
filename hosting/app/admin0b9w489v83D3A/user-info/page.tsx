"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
import { FireStoreAdminRepository } from "repository/FireStoreAdminRepository";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";
import type { UserInfoEntity } from "model/UserInfoEntity";
import UserInfoDetailModal from "./UserInfoDetailModal";
import {
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { addToast } from "@heroui/toast";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [seasons, setSeasons] = useState<LectureSeasonEntity[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("");
  const [users, setUsers] = useState<UserInfoEntity[]>([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<UserInfoEntity | null>(null);
  const unsubscribeUsersRef = useRef<null | (() => void)>(null);

  const fetchSeasons = async () => {
    try {
      const seasonList = await FireStoreAdminRepository.getAllLectureSeason();
      setSeasons(seasonList);
      if (seasonList.length > 0 && !selectedSeasonId) {
        setSelectedSeasonId(seasonList[0].id);
      }
    } catch (e) {
      addToast({ title: "シーズンの取得に失敗しました。", color: "danger" });
    }
  };

  const startUsersListener = () => {
    setIsLoading(true);
    if (unsubscribeUsersRef.current) {
      unsubscribeUsersRef.current();
    }
    unsubscribeUsersRef.current = FireStoreAdminRepository.getAllUserInfo(
      (data) => {
        setUsers(data);
        setIsLoading(false);
      },
      () => {
        addToast({ title: "ユーザー情報の取得に失敗しました。", color: "danger" });
        setIsLoading(false);
      },
    );
  };

  useEffect(() => {
    fetchSeasons();
    startUsersListener();
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

  const openDetail = (user: UserInfoEntity) => {
    setDetailTarget(user);
    setIsDetailOpen(true);
  };

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
        <AdminNavBar title="ユーザー情報" />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
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
            <div className="text-lg font-bold text-neutral-800 mb-4">ユーザー一覧</div>
            <Table aria-label="ユーザー一覧">
              <TableHeader>
                <TableColumn>名前</TableColumn>
                <TableColumn>ふりがな</TableColumn>
                <TableColumn>メール</TableColumn>
                <TableColumn>Webスキル</TableColumn>
                <TableColumn>プログラミング経験</TableColumn>
                <TableColumn>利用AI</TableColumn>
              </TableHeader>
              <TableBody
                items={filteredUsers}
                emptyContent="ユーザーがいません"
              >
                {(item) => (
                  <TableRow
                    key={item.uid}
                    className="cursor-pointer"
                    onClick={() => openDetail(item)}
                  >
                    <TableCell>{`${item.lastName} ${item.firstName}`.trim() || "-"}</TableCell>
                    <TableCell>{`${item.lastNameKana} ${item.firstNameKana}`.trim() || "-"}</TableCell>
                    <TableCell>{item.email || "-"}</TableCell>
                    <TableCell>{item.webSkill || "-"}</TableCell>
                    <TableCell>{item.programmingExp || "-"}</TableCell>
                    <TableCell>{item.aiServices?.join(", ") || "-"}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <UserInfoDetailModal
          isOpen={isDetailOpen}
          onOpenChange={(open) => {
            setIsDetailOpen(open);
            if (!open) setDetailTarget(null);
          }}
          user={detailTarget}
        />
      </div>
    </AdminAuth>
  );
};

export default Page;
