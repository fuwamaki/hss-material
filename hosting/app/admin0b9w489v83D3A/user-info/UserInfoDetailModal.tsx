"use client";

import type { UserInfoEntity } from "model/UserInfoEntity";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

interface UserInfoDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserInfoEntity | null;
}

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

const UserInfoDetailModal = ({ isOpen, onOpenChange, user }: UserInfoDetailModalProps) => {
  const rows: Array<[string, string]> = [
    ["ID", user?.id || "-"],
    ["UID", user?.uid || "-"],
    ["氏名", user ? `${user.lastName} ${user.firstName}`.trim() : "-"],
    ["ふりがな", user ? `${user.lastNameKana} ${user.firstNameKana}`.trim() : "-"],
    ["メール", user?.email || "-"],
    ["シーズンID", user?.seasonId || "-"],
    ["シーズン名", user?.seasonName || "-"],
    ["タイピングスキル", user?.typingSkillLevel?.toString() ?? "-"],
    ["Webスキル", user?.webSkill || "-"],
    ["プログラミング経験", user?.programmingExp || "-"],
    ["利用AIサービス", user?.aiServices?.join(", ") || "-"],
    ["AIサービス用途", user?.aiUsage || "-"],
    ["プロジェクト期待", user?.projectExpect || "-"],
    ["作成日時", formatDate(user?.createdAt)],
    ["更新日時", formatDate(user?.updatedAt)],
  ];

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
            <ModalHeader className="text-lg font-bold">ユーザー詳細</ModalHeader>
            <ModalBody>
              <Table aria-label="ユーザー詳細">
                <TableHeader>
                  <TableColumn>項目</TableColumn>
                  <TableColumn>内容</TableColumn>
                </TableHeader>
                <TableBody items={rows}>
                  {(item) => (
                    <TableRow key={item[0]}>
                      <TableCell className="whitespace-nowrap text-sm text-neutral-500">{item[0]}</TableCell>
                      <TableCell className="text-sm text-neutral-800 whitespace-pre-line wrap-break-word">
                        {item[1]}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="flat"
                color="default"
                onPress={onClose}
              >
                閉じる
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserInfoDetailModal;
