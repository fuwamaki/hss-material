"use client";
import { useEffect, useMemo, useState } from "react";
import AdminAuth from "../AdminAuth";
import AdminNavBar from "component/AdminNavBar";
import { FireStoreAdminRepository } from "repository/FireStoreAdminRepository";
import type { DocumentEntity } from "model/DocumentEntity";
import { DocumentationType } from "enum/DocumentationType";
import EditDocumentModal from "./EditDocumentModal";
import ViewDocumentModal from "./ViewDocumentModal";
import MarkdownPreview from "component/MarkdownPreview";
import {
  Button,
  Input,
  Spinner,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@heroui/react";
import { addToast } from "@heroui/toast";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentEntity[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentationType>(DocumentationType.FirstDay);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [orderId, setOrderId] = useState<number>(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<DocumentEntity | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<DocumentEntity | null>(null);

  const documentationTabs = useMemo(
    () => [
      { typeId: DocumentationType.FirstDay, label: "初日説明" },
      { typeId: DocumentationType.Faq, label: "FAQ" },
      { typeId: DocumentationType.FinalDay, label: "最終日" },
      { typeId: DocumentationType.Step1Setup, label: "Step1: セットアップ" },
      { typeId: DocumentationType.Step2CommonTask, label: "Step2: 共通課題" },
      { typeId: DocumentationType.Step3OriginalWeb, label: "Step3: オリジナルWebサイト" },
    ],
    [],
  );

  const fetchDocuments = async (typeId: DocumentationType) => {
    setIsLoading(true);
    try {
      const data = await FireStoreAdminRepository.getDocumentsByType(typeId);
      setDocuments(data);
    } catch (e) {
      console.error(e);
      addToast({ title: "ドキュメントの取得に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(selectedType);
  }, [selectedType]);

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => (a.orderId ?? 0) - (b.orderId ?? 0));
  }, [documents]);

  const nextOrderId = useMemo(() => {
    if (documents.length === 0) return 0;
    const max = Math.max(...documents.map((doc) => (typeof doc.orderId === "number" ? doc.orderId : 0)));
    return max;
  }, [documents]);

  useEffect(() => {
    if (!title.trim() && !body.trim()) {
      setOrderId(nextOrderId);
    }
  }, [nextOrderId, title, body]);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setOrderId(nextOrderId);
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      addToast({ title: "タイトルを入力してください。", color: "warning" });
      return;
    }
    if (!body.trim()) {
      addToast({ title: "本文を入力してください。", color: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.addDocument(title.trim(), body.trim(), selectedType, orderId);
      addToast({ title: "ドキュメントを追加しました。", color: "success" });
      resetForm();
      await fetchDocuments(selectedType);
    } catch (e) {
      addToast({ title: "保存に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (doc: DocumentEntity) => {
    setEditTarget(doc);
    setIsEditOpen(true);
  };

  const handleUpdate = async (payload: { title: string; body: string; orderId: number }) => {
    if (!editTarget) return;
    if (!payload.title.trim()) {
      addToast({ title: "タイトルを入力してください。", color: "warning" });
      return;
    }
    if (!payload.body.trim()) {
      addToast({ title: "本文を入力してください。", color: "warning" });
      return;
    }
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.updateDocument(editTarget.id, {
        title: payload.title.trim(),
        body: payload.body.trim(),
        orderId: payload.orderId,
      });
      addToast({ title: "ドキュメントを更新しました。", color: "success" });
      setIsEditOpen(false);
      setEditTarget(null);
      await fetchDocuments(selectedType);
    } catch (e) {
      addToast({ title: "更新に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (doc: DocumentEntity) => {
    if (!confirm(`「${doc.title}」を削除しますか？`)) return;
    setIsLoading(true);
    try {
      await FireStoreAdminRepository.deleteDocument(doc.id);
      addToast({ title: "ドキュメントを削除しました。", color: "success" });
      await fetchDocuments(selectedType);
    } catch (e) {
      addToast({ title: "削除に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (doc: DocumentEntity) => {
    setViewTarget(doc);
    setIsViewOpen(true);
  };

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

  const getBodyPreview = (text: string, lines = 2) => {
    const raw = text || "";
    const split = raw.split("\n");
    const preview = split.slice(0, lines).join("\n");
    const hasMore = split.length > lines;
    return { preview, hasMore };
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
        <AdminNavBar title="ドキュメント管理" />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <Tabs
              aria-label="ドキュメント種別"
              color="primary"
              variant="underlined"
              selectedKey={String(selectedType)}
              onSelectionChange={(key) => setSelectedType(Number(key) as DocumentationType)}
            >
              {documentationTabs.map((tab) => (
                <Tab
                  key={String(tab.typeId)}
                  title={tab.label}
                />
              ))}
            </Tabs>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-lg font-bold text-neutral-800 mb-4">追加フォーム</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="タイトル"
                placeholder="例：初日の流れ"
                value={title}
                onValueChange={setTitle}
              />
              <Input
                label="表示順"
                type="number"
                value={String(orderId)}
                onValueChange={(value) => setOrderId(Number(value) || 0)}
              />
            </div>
            <div className="mt-4">
              <Tabs
                aria-label="本文入力とプレビュー"
                color="primary"
                variant="underlined"
              >
                <Tab
                  key="edit"
                  title="編集"
                >
                  <Textarea
                    label="本文"
                    placeholder="本文を入力してください"
                    minRows={6}
                    maxRows={30}
                    value={body}
                    onValueChange={setBody}
                  />
                </Tab>
                <Tab
                  key="preview"
                  title="プレビュー"
                >
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 max-h-[60vh] overflow-y-auto">
                    {body.trim() ? (
                      <MarkdownPreview content={body} />
                    ) : (
                      <div className="text-sm text-neutral-500">プレビューする本文がありません。</div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                color="primary"
                onPress={handleAdd}
              >
                追加する
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-lg font-bold text-neutral-800 mb-4">一覧</div>
            <Table aria-label="ドキュメント一覧">
              <TableHeader>
                <TableColumn>表示順</TableColumn>
                <TableColumn>タイトル</TableColumn>
                <TableColumn>本文</TableColumn>
                <TableColumn>更新日時</TableColumn>
                <TableColumn>操作</TableColumn>
              </TableHeader>
              <TableBody
                emptyContent="ドキュメントがありません。"
                items={sortedDocuments}
              >
                {(doc) => {
                  const { preview, hasMore } = getBodyPreview(doc.body || "");
                  return (
                    <TableRow key={doc.id}>
                      <TableCell>{typeof doc.orderId === "number" ? doc.orderId : "-"}</TableCell>
                      <TableCell className="font-semibold text-neutral-800">{doc.title}</TableCell>
                      <TableCell>
                        <div className="whitespace-pre-wrap text-sm text-neutral-700 max-w-md">
                          {preview || "-"}
                          {hasMore && "\n..."}
                        </div>
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => handleView(doc)}
                          >
                            全文を見る
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(doc.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => handleEdit(doc)}
                          >
                            編集
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => handleDelete(doc)}
                          >
                            削除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }}
              </TableBody>
            </Table>
          </div>
        </div>

        <EditDocumentModal
          isOpen={isEditOpen}
          onOpenChange={setIsEditOpen}
          document={editTarget}
          onSubmit={handleUpdate}
          isSubmitting={isLoading}
        />

        <ViewDocumentModal
          isOpen={isViewOpen}
          onOpenChange={(open) => {
            setIsViewOpen(open);
            if (!open) setViewTarget(null);
          }}
          document={viewTarget}
        />
      </div>
    </AdminAuth>
  );
};

export default Page;
