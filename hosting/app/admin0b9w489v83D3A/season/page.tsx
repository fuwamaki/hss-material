"use client";
import { useEffect, useMemo, useState } from "react";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
import { FireStoreAdminRepository } from "repository/FireStoreAdminRepository";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";
import EditLectureSeasonModal from "./EditLectureSeasonModal";
import {
  Button,
  Input,
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import CheckIcon from "icons/check";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [seasons, setSeasons] = useState<LectureSeasonEntity[]>([]);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<LectureSeasonEntity | null>(null);

  const fetchSeasons = async () => {
    setIsLoading(true);
    try {
      const data = await FireStoreAdminRepository.getAllLectureSeason();
      setSeasons(data);
    } catch (e) {
      addToast({ title: "シーズンの取得に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const resetForm = () => {
    setName("");
    setIsActive(false);
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      addToast({ title: "シーズン名を入力してください。", color: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.addLectureSeason(name.trim(), isActive);
      addToast({ title: "シーズンを追加しました。", color: "success" });
      resetForm();
      await fetchSeasons();
    } catch (e) {
      addToast({ title: "追加に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (season: LectureSeasonEntity) => {
    setEditTarget(season);
    setIsEditOpen(true);
  };

  const handleUpdate = async (payload: { name: string; isActive: boolean }) => {
    if (!editTarget) return;
    if (!payload.name.trim()) {
      addToast({ title: "シーズン名を入力してください。", color: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.updateLectureSeason(editTarget.id, {
        name: payload.name.trim(),
        isActive: payload.isActive,
      });
      addToast({ title: "シーズンを更新しました。", color: "success" });
      setIsEditOpen(false);
      setEditTarget(null);
      await fetchSeasons();
    } catch (e) {
      addToast({ title: "更新に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (season: LectureSeasonEntity) => {
    if (!confirm(`「${season.name}」を削除しますか？`)) return;
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.deleteLectureSeason(season.id);
      addToast({ title: "シーズンを削除しました。", color: "success" });
      await fetchSeasons();
    } catch (e) {
      addToast({ title: "削除に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedSeasons = useMemo(() => {
    return [...seasons];
  }, [seasons]);

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
        <AdminNavBar title="シーズン管理" />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-lg font-bold text-neutral-800 mb-4">シーズン追加</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="シーズン名"
                placeholder="例：2026_b"
                value={name}
                onValueChange={setName}
              />
              <Switch
                isSelected={!!isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              >
                Active
              </Switch>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                color="primary"
                onPress={handleAdd}
              >
                追加する
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-lg font-bold text-neutral-800 mb-4">シーズン一覧</div>
            <Table aria-label="シーズン一覧">
              <TableHeader>
                <TableColumn>シーズン名</TableColumn>
                <TableColumn>Active</TableColumn>
                <TableColumn>操作</TableColumn>
              </TableHeader>
              <TableBody
                items={sortedSeasons}
                emptyContent="シーズンがありません"
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      {item.isActive && (
                        <span className="text-emerald-600 flex items-center justify-start">
                          <CheckIcon
                            width={20}
                            height={20}
                          />
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => handleEdit(item)}
                        >
                          編集
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={() => handleDelete(item)}
                        >
                          削除
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <EditLectureSeasonModal
          isOpen={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setEditTarget(null);
          }}
          season={editTarget}
          onSubmit={handleUpdate}
          isSubmitting={isLoading}
        />
      </div>
    </AdminAuth>
  );
};

export default Page;
