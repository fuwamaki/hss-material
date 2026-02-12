"use client";
import { useEffect, useMemo, useState } from "react";
import AdminNavBar from "component/AdminNavBar";
import AdminAuth from "../AdminAuth";
import { FireStoreAdminRepository } from "repository/FireStoreAdminRepository";
import type { NoticeEntity } from "model/NoticeEntity";
import EditNoticeModal from "./EditNoticeModal";
import {
  Button,
  Input,
  Textarea,
  Switch,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@heroui/react";
import CheckIcon from "icons/check.jsx";
import { addToast } from "@heroui/toast";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notices, setNotices] = useState<NoticeEntity[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublish, setIsPublish] = useState(true);
  const [orderId, setOrderId] = useState<number>(1);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<NoticeEntity | null>(null);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const data = await FireStoreAdminRepository.getAllNotice();
      setNotices(data);
    } catch (e) {
      addToast({ title: "お知らせの取得に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const sortedNotices = useMemo(() => {
    return [...notices].sort((a, b) => (a.orderId ?? 0) - (b.orderId ?? 0));
  }, [notices]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsPublish(true);
    setOrderId(1);
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      addToast({ title: "タイトルを入力してください。", color: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.addNotice(title.trim(), description.trim(), isPublish, orderId);
      addToast({ title: "お知らせを追加しました。", color: "success" });
      resetForm();
      await fetchNotices();
    } catch (e) {
      addToast({ title: "保存に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (notice: NoticeEntity) => {
    setEditTarget(notice);
    setIsEditOpen(true);
  };

  const handleUpdate = async (payload: { title: string; description: string; isPublish: boolean; orderId: number }) => {
    if (!editTarget) return;
    if (!payload.title.trim()) {
      addToast({ title: "タイトルを入力してください。", color: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.updateNotice(editTarget.id, {
        title: payload.title.trim(),
        description: payload.description.trim(),
        isPublish: payload.isPublish,
        orderId: payload.orderId,
      });
      addToast({ title: "お知らせを更新しました。", color: "success" });
      setIsEditOpen(false);
      setEditTarget(null);
      await fetchNotices();
    } catch (e) {
      addToast({ title: "更新に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (notice: NoticeEntity) => {
    if (!confirm(`「${notice.title}」を削除しますか？`)) return;
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.deleteNotice(notice.id);
      addToast({ title: "お知らせを削除しました。", color: "success" });
      await fetchNotices();
    } catch (e) {
      addToast({ title: "削除に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (value: unknown) => {
    if (!value) return "-";
    if (value instanceof Date) return value.toLocaleString();
    if (typeof value === "string") return new Date(value).toLocaleString();
    if (typeof value === "object") {
      const obj = value as { toDate?: () => Date; seconds?: number };
      if (typeof obj.toDate === "function") {
        return obj.toDate().toLocaleString();
      }
      if (typeof obj.seconds === "number") {
        return new Date(obj.seconds * 1000).toLocaleString();
      }
    }
    return "-";
  };

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
        <AdminNavBar title={"お知らせ管理"} />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-lg font-bold text-neutral-800 mb-4">追加フォーム</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="タイトル"
                placeholder="例：第1回の授業について"
                value={title}
                onValueChange={setTitle}
              />
              <Input
                label="表示順"
                type="number"
                value={String(orderId)}
                onValueChange={(value) => setOrderId(Number(value) || 1)}
              />
            </div>
            <div className="mt-4">
              <Textarea
                label="本文"
                placeholder="お知らせ本文を入力してください"
                minRows={4}
                value={description}
                onValueChange={setDescription}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
              <Switch
                isSelected={isPublish}
                onChange={(e) => setIsPublish(e.target.checked)}
              >
                公開
              </Switch>
              <div className="flex items-center gap-2">
                <Button
                  color="primary"
                  onPress={handleAdd}
                >
                  追加する
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-lg font-bold text-neutral-800 mb-4">一覧</div>
            <Table aria-label="お知らせ一覧">
              <TableHeader>
                <TableColumn>表示順</TableColumn>
                <TableColumn>タイトル</TableColumn>
                <TableColumn>公開</TableColumn>
                <TableColumn>更新日時</TableColumn>
                <TableColumn>操作</TableColumn>
              </TableHeader>
              <TableBody
                items={sortedNotices}
                emptyContent="お知らせがありません"
              >
                {(item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.orderId ?? "-"}</TableCell>
                    <TableCell>
                      <div className="font-semibold text-neutral-800">{item.title}</div>
                      <div className="text-xs text-neutral-500 line-clamp-2 mt-1">{item.description}</div>
                    </TableCell>
                    <TableCell>
                      {item.isPublish && (
                        <span className="text-emerald-600 flex items-center justify-center">
                          <CheckIcon
                            width={20}
                            height={20}
                          />
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(item.updatedAt)}</TableCell>
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
        <EditNoticeModal
          isOpen={isEditOpen}
          onOpenChange={(open) => {
            setIsEditOpen(open);
            if (!open) setEditTarget(null);
          }}
          notice={editTarget}
          onSubmit={handleUpdate}
          isSubmitting={isLoading}
        />
      </div>
    </AdminAuth>
  );
};

export default Page;
