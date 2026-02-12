"use client";

import type { DocumentEntity } from "model/DocumentEntity";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface ViewDocumentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentEntity | null;
}

const ViewDocumentModal = ({ isOpen, onOpenChange, document }: ViewDocumentModalProps) => {
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
            <ModalHeader className="text-lg font-bold">{document?.title || "本文"}</ModalHeader>
            <ModalBody>
              <div className="whitespace-pre-wrap text-sm text-neutral-700 max-h-[60vh] overflow-y-auto">
                {document?.body || ""}
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewDocumentModal;
