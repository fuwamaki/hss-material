"use client";

import { useEffect, useMemo, useState } from "react";
import CommonNavBar from "component/CommonNavBar";
import { FireStoreRepository } from "repository/FireStoreRepository";
import type { DocumentEntity } from "model/DocumentEntity";
import { DocumentationType } from "enum/DocumentationType";
import MarkdownPreview from "component/MarkdownPreview";
import { Spinner } from "@heroui/react";
import { addToast } from "@heroui/toast";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentEntity[]>([]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const data = await FireStoreRepository.getDocumentsByType(DocumentationType.Step1Setup);
      setDocuments(data);
    } catch (e) {
      console.error(e);
      addToast({ title: "ドキュメントの取得に失敗しました。", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => (a.orderId ?? 0) - (b.orderId ?? 0));
  }, [documents]);

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

  return (
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
      <CommonNavBar title="Step1: セットアップ" />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {sortedDocuments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 text-center text-sm text-neutral-500">
            ドキュメントがありません。
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
              >
                <div className="flex flex-col gap-2">
                  <div className="text-lg font-bold text-neutral-900">{doc.title}</div>
                  <div className="text-xs text-neutral-500">更新: {formatDate(doc.updatedAt)}</div>
                </div>
                <div className="mt-4">
                  <MarkdownPreview content={doc.body || ""} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
