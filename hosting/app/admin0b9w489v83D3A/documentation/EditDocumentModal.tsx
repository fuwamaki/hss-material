"use client";

import { useEffect, useState } from "react";
import type { DocumentEntity } from "model/DocumentEntity";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tab,
  Tabs,
  Textarea,
} from "@heroui/react";
import MarkdownPreview from "component/MarkdownPreview";

interface EditDocumentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentEntity | null;
  onSubmit: (payload: { title: string; body: string; orderId: number }) => void;
  isSubmitting: boolean;
}

const EditDocumentModal = ({ isOpen, onOpenChange, document, onSubmit, isSubmitting }: EditDocumentModalProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [orderId, setOrderId] = useState<number>(1);

  useEffect(() => {
    if (!document) return;
    setTitle(document.title || "");
    setBody(document.body || "");
    setOrderId(typeof document.orderId === "number" ? document.orderId : 1);
  }, [document]);

  const handleSubmit = () => {
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      orderId,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-bold">ドキュメントを編集</ModalHeader>
            <ModalBody>
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
                  onValueChange={(value) => setOrderId(Number(value) || 1)}
                />
              </div>
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
                    minRows={20}
                    maxRows={20}
                    value={body}
                    onValueChange={setBody}
                  />
                </Tab>
                <Tab
                  key="preview"
                  title="プレビュー"
                >
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 max-h-110 overflow-y-auto">
                    {body.trim() ? (
                      <MarkdownPreview content={body} />
                    ) : (
                      <div className="text-sm text-neutral-500">プレビューする本文がありません。</div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="flat"
                color="default"
                onPress={onClose}
              >
                閉じる
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!title.trim() || !body.trim()}
              >
                更新する
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default EditDocumentModal;
