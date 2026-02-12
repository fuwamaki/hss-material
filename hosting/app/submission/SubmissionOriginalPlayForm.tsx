"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@heroui/react";
import type { SubmissionOriginalPlayEntity } from "model/SubmissionOriginalPlayEntity";

interface SubmissionOriginalPlayFormProps {
  initial?: SubmissionOriginalPlayEntity | null;
  isSubmitting: boolean;
  onSubmit: (payload: { title: string; targetUser: string; userStory: string }) => void;
}

const SubmissionOriginalPlayForm = ({ initial, isSubmitting, onSubmit }: SubmissionOriginalPlayFormProps) => {
  const [title, setTitle] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [userStory, setUserStory] = useState("");

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title || "");
    setTargetUser(initial.targetUser || "");
    setUserStory(initial.userStory || "");
  }, [initial]);

  return (
    <div className="space-y-4">
      <Input
        label="タイトル"
        placeholder="例：学習支援アプリ"
        value={title}
        onValueChange={setTitle}
        isRequired
      />
      <Textarea
        label="想定ユーザー"
        placeholder="どんな人を対象にするか"
        minRows={3}
        value={targetUser}
        onValueChange={setTargetUser}
        isRequired
      />
      <Textarea
        label="ユーザーストーリー"
        placeholder="どんな課題をどう解決するか"
        minRows={6}
        value={userStory}
        onValueChange={setUserStory}
        isRequired
      />
      <div className="flex justify-end">
        <Button
          color="primary"
          onPress={() => onSubmit({ title, targetUser, userStory })}
          isLoading={isSubmitting}
          isDisabled={!title.trim() || !targetUser.trim() || !userStory.trim()}
        >
          提出する
        </Button>
      </div>
    </div>
  );
};

export default SubmissionOriginalPlayForm;
