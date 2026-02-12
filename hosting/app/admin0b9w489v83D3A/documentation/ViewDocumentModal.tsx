"use client";

import type { DocumentEntity } from "model/DocumentEntity";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import MarkdownPreview from "component/MarkdownPreview";

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
              <div className="max-h-[60vh] overflow-y-auto">
                <MarkdownPreview
                  content={document?.body || ""}
                  className="text-sm text-neutral-700"
                />
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
