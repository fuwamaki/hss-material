"use client";

import type { UserInfoEntity } from "model/UserInfoEntity";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@heroui/react";

interface UserReflectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserInfoEntity | null;
}

const UserReflectionModal = ({ isOpen, onOpenChange, user }: UserReflectionModalProps) => {
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
            <ModalHeader className="text-lg font-bold">振り返りアンケート</ModalHeader>
            <ModalBody>
              <Textarea
                label="感想（必須）"
                value={user?.reflectionImpression || ""}
                isReadOnly
                minRows={4}
              />
              <Textarea
                label="良かった点（任意）"
                value={user?.reflectionGood || ""}
                isReadOnly
                minRows={3}
              />
              <Textarea
                label="改善してほしい点（任意）"
                value={user?.reflectionImprove || ""}
                isReadOnly
                minRows={3}
              />
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

export default UserReflectionModal;
