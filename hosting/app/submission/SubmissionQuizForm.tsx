"use client";

import { useEffect, useState } from "react";
import { Button, Textarea } from "@heroui/react";
import type { SubmissionQuizEntity } from "model/SubmissionQuizEntity";

interface SubmissionQuizFormProps {
  initial?: SubmissionQuizEntity | null;
  isSubmitting: boolean;
  onSubmit: (payload: { keyFeature: string; sourceCode: string }) => void;
}

const SubmissionQuizForm = ({ initial, isSubmitting, onSubmit }: SubmissionQuizFormProps) => {
  const [keyFeature, setKeyFeature] = useState("");
  const [sourceCode, setSourceCode] = useState("");

  useEffect(() => {
    if (!initial) return;
    setKeyFeature(initial.keyFeature || "");
    setSourceCode(initial.sourceCode || "");
  }, [initial]);

  return (
    <div className="space-y-4">
      <Textarea
        label="工夫したポイント"
        placeholder="こだわった点・工夫点を記載"
        minRows={4}
        value={keyFeature}
        onValueChange={setKeyFeature}
        isRequired
      />
      <Textarea
        label="ソースコード"
        placeholder="コードを貼り付けてください"
        minRows={8}
        value={sourceCode}
        onValueChange={setSourceCode}
        isRequired
      />
      <div className="flex justify-end">
        <Button
          color="primary"
          onPress={() => onSubmit({ keyFeature, sourceCode })}
          isLoading={isSubmitting}
          isDisabled={!keyFeature.trim() || !sourceCode.trim()}
        >
          提出する
        </Button>
      </div>
    </div>
  );
};

export default SubmissionQuizForm;
