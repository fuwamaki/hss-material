"use client";

import { useEffect, useState } from "react";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch } from "@heroui/react";

interface EditLectureSeasonModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  season: LectureSeasonEntity | null;
  onSubmit: (payload: { name: string; isActive: boolean }) => void;
  isSubmitting: boolean;
}

const EditLectureSeasonModal = ({
  isOpen,
  onOpenChange,
  season,
  onSubmit,
  isSubmitting,
}: EditLectureSeasonModalProps) => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!season) return;
    setName(season.name || "");
    setIsActive(!!season.isActive);
  }, [season]);

  const handleSubmit = () => {
    onSubmit({
      name: name.trim(),
      isActive,
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
            <ModalHeader className="text-lg font-bold">シーズンを編集</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="シーズン名"
                  placeholder="例：2026 春"
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
                isDisabled={!name.trim()}
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

export default EditLectureSeasonModal;
