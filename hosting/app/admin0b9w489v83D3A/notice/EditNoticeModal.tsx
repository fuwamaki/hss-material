"use client";

import { useEffect, useState } from "react";
import type { NoticeEntity } from "model/NoticeEntity";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
  Textarea,
} from "@heroui/react";

interface EditNoticeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  notice: NoticeEntity | null;
  onSubmit: (payload: {
    title: string;
    description: string;
    isPublish: boolean;
    orderId: number;
    seasonId: string;
  }) => void;
  isSubmitting: boolean;
  seasons: LectureSeasonEntity[];
}

const EditNoticeModal = ({ isOpen, onOpenChange, notice, onSubmit, isSubmitting, seasons }: EditNoticeModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublish, setIsPublish] = useState(true);
  const [orderId, setOrderId] = useState<number>(1);
  const [seasonId, setSeasonId] = useState<string>("");

  useEffect(() => {
    if (!notice) return;
    setTitle(notice.title || "");
    setDescription(notice.description || "");
    setIsPublish(notice.isPublish);
    setOrderId(typeof notice.orderId === "number" ? notice.orderId : 1);
    setSeasonId(notice.seasonId || "");
  }, [notice]);

  const handleSubmit = () => {
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      isPublish,
      orderId,
      seasonId,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-lg font-bold">お知らせを編集</ModalHeader>
            <ModalBody>
              <Select
                label="シーズン"
                placeholder="選択してください"
                selectedKeys={seasonId ? new Set([seasonId]) : new Set()}
                onSelectionChange={(keys) => {
                  if (keys === "all") return;
                  const value = Array.from(keys)[0];
                  setSeasonId(value ? String(value) : "");
                }}
              >
                {seasons.map((season) => (
                  <SelectItem key={season.id}>{season.name}</SelectItem>
                ))}
              </Select>
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
              <Textarea
                label="本文"
                placeholder="お知らせ本文を入力してください"
                minRows={4}
                value={description}
                onValueChange={setDescription}
              />
              <Switch
                isSelected={isPublish}
                onChange={(e) => setIsPublish(e.target.checked)}
              >
                公開
              </Switch>
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
                isDisabled={!title.trim() || !seasonId}
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

export default EditNoticeModal;
